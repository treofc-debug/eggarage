'use strict';
/* Sincronização com o Supabase.
   - Os dados continuam salvos no aparelho (IndexedDB) => funciona offline.
   - Cada OS alterada é marcada como pendente (_dirty) e enviada para a nuvem.
   - Fotos vão para o Storage (bucket privado "fotos"); no JSON fica só o caminho.
   - Ao abrir/voltar ao app, baixa o que outros aparelhos alteraram. */
const Cloud = (() => {
  const conf = window.SUPA || {};
  const on = !!(conf.url && conf.key && window.supabase);
  let sb = null, user = null, syncing = null, again = false;
  const LS = { last: 'os_sync_last', up: 'os_sync_up', del: 'os_sync_del', cfg: 'os_sync_cfg' };
  const lsGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } };
  const status = { st: on ? 'idle' : 'off', msg: '', at: lsGet(LS.last, null) };
  const listeners = new Set();
  const emit = (st, msg = '') => { status.st = st; status.msg = msg; listeners.forEach(f => { try { f(status); } catch (e) { } }); };

  const toDataURL = b => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); });
  const uploaded = () => new Set(lsGet(LS.up, []));

  function init() { if (on && !sb) sb = window.supabase.createClient(conf.url, conf.key, { auth: { persistSession: true, autoRefreshToken: true } }); }
  async function session() { init(); const { data } = await sb.auth.getSession(); user = data.session?.user || null; return user; }
  async function login(email, password) {
    init();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw new Error(/invalid/i.test(error.message) ? 'E-mail ou senha incorretos' : error.message);
    user = data.user; return user;
  }
  async function logout() {
    await sb.auth.signOut(); user = null;
    Object.values(LS).forEach(k => { try { localStorage.removeItem(k); } catch (e) { } });
  }

  // ---------- envio ----------
  async function pushOrder(o) {
    const up = uploaded(), copy = JSON.parse(JSON.stringify(o));
    delete copy._dirty;
    for (const f of copy.fotos) {
      if (!f.path) f.path = `${o.id}/${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}.jpg`;
      if (!up.has(f.path) && f.data) {
        const blob = await (await fetch(f.data)).blob();
        const { error } = await sb.storage.from('fotos').upload(f.path, blob, { contentType: 'image/jpeg', upsert: true });
        if (error) throw error;
        up.add(f.path); lsSet(LS.up, [...up]);
      }
      delete f.data;
    }
    const { error } = await sb.from('ordens').upsert({ id: o.id, data: copy, updated_at: o.updatedAt, deleted: false });
    if (error) throw error;
    return copy.fotos.map(f => f.path);
  }
  async function pushDeletes() {
    const dels = lsGet(LS.del, []);
    for (const d of [...dels]) {
      const { error } = await sb.from('ordens').upsert({ id: d.id, data: {}, updated_at: new Date().toISOString(), deleted: true });
      if (error) throw error;
      if (d.paths?.length) await sb.storage.from('fotos').remove(d.paths);
      dels.splice(dels.findIndex(x => x.id === d.id), 1); lsSet(LS.del, dels);
    }
  }
  function queueDelete(o) {
    if (!on) return;
    const dels = lsGet(LS.del, []); dels.push({ id: o.id, paths: (o.fotos || []).map(f => f.path).filter(Boolean) }); lsSet(LS.del, dels);
    sync();
  }
  function removePhoto(path) { if (on && user && path) sb.storage.from('fotos').remove([path]).catch(() => { }); }

  // ---------- recebimento ----------
  async function hydrate(remote, local) {
    const known = new Map((local?.fotos || []).filter(f => f.path && f.data).map(f => [f.path, f.data]));
    const up = uploaded();
    for (const f of remote.fotos || []) {
      if (f.data) continue;
      if (known.has(f.path)) { f.data = known.get(f.path); continue; }
      const { data, error } = await sb.storage.from('fotos').download(f.path);
      if (error) { console.warn('foto', f.path, error); continue; }
      f.data = await toDataURL(data); up.add(f.path);
    }
    lsSet(LS.up, [...up]);
    return remote;
  }
  async function pull(DB) {
    const last = lsGet(LS.last, null);
    let q = sb.from('ordens').select('id,data,updated_at,deleted').order('updated_at');
    if (last) q = q.gt('updated_at', new Date(new Date(last).getTime() - 60000).toISOString()); // 1 min de folga
    const { data, error } = await q;
    if (error) throw error;
    let changed = 0, maxAt = last;
    for (const r of data) {
      if (!maxAt || r.updated_at > maxAt) maxAt = r.updated_at;
      const local = await DB.get(r.id);
      if (r.deleted) { if (local) { await DB.del(r.id); changed++; } continue; }
      if (local && (local._dirty || new Date(local.updatedAt) >= new Date(r.data.updatedAt))) continue;
      await DB.put(await hydrate(r.data, local)); changed++;
    }
    if (maxAt) { lsSet(LS.last, maxAt); status.at = new Date().toISOString(); }
    return changed;
  }

  // ---------- configurações da oficina ----------
  async function syncCfg(cfg, saveLocal) {
    const dirty = lsGet(LS.cfg, false);
    const { data, error } = await sb.from('config').select('data,updated_at').eq('id', 1).maybeSingle();
    if (error) throw error;
    const remoteU = data?.data?._u || '';
    if (dirty && (!remoteU || (cfg._u || '') >= remoteU)) {
      const { error: e2 } = await sb.from('config').upsert({ id: 1, data: cfg, updated_at: new Date().toISOString() });
      if (e2) throw e2; lsSet(LS.cfg, false); return false;
    }
    if (data && remoteU > (cfg._u || '')) { saveLocal(data.data); lsSet(LS.cfg, false); return true; }
    return false;
  }
  const cfgDirty = () => lsSet(LS.cfg, true);

  // ---------- ciclo completo ----------
  async function sync(opts = {}) {
    if (!on || !user) return 0;
    if (syncing) { again = true; return syncing; }
    if (!navigator.onLine) { emit('offline', 'Sem internet — os dados serão enviados depois'); return 0; }
    const { DB, cfg, saveLocalCfg, onDraftPaths } = Cloud.ctx;
    emit('sync');
    syncing = (async () => {
      let changed = 0;
      try {
        for (const o of (await DB.all()).filter(x => x._dirty)) {
          const paths = await pushOrder(o);
          const cur = await DB.get(o.id);
          if (cur && cur.updatedAt === o.updatedAt) { cur.fotos.forEach((f, i) => { if (!f.path) f.path = paths[i]; }); delete cur._dirty; await DB.put(cur); }
          onDraftPaths?.(o.id, paths);
        }
        await pushDeletes();
        if (await syncCfg(cfg(), saveLocalCfg)) changed++;
        changed += await pull(DB);
        status.at = new Date().toISOString();
        emit('ok');
      } catch (e) {
        console.error('sync', e);
        emit('erro', e.message || String(e));
      } finally { syncing = null; }
      if (again) { again = false; return sync(opts); }
      return changed;
    })();
    return syncing;
  }

  return {
    on, init, session, login, logout, sync, queueDelete, removePhoto, cfgDirty, status,
    get user() { return user; },
    onStatus: f => listeners.add(f),
    ctx: {},
  };
})();
