'use strict';
/* ===================== utilidades ===================== */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = v => { const n = parseFloat(String(v ?? '').replace(',', '.')); return isFinite(n) ? n : 0; };
const brl = v => num(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const numFmt = n => String(n || 0).padStart(4, '0');
const fmtDate = d => d ? new Date(d.length === 10 ? d + 'T12:00' : d).toLocaleDateString('pt-BR') : '';
const fmtDateTime = d => d ? new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const getPath = (o, p) => p.split('.').reduce((a, k) => a?.[k], o);
const setPath = (o, p, v) => { const ks = p.split('.'); const last = ks.pop(); ks.reduce((a, k) => a[k], o)[last] = v; };
const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();

const ICON = {
  home: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  list: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9zM9 11h6M9 15h4"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6M16 4a4 4 0 0 1 0 8M22 21c0-3-2-5-4-5.5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  back: '<path d="M15 18l-6-6 6-6"/>',
  chev: '<path d="M9 18l6-6-6-6"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-10 9"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  wa: '<path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 9.2c.2 3 2.6 5.5 5.6 5.7l1.2-1.4-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  file: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
  share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  car: '<path d="M5 17V12l2.2-5h9.6L19 12v5M3 12h18v5H3z"/><circle cx="7.5" cy="14.5" r="1"/><circle cx="16.5" cy="14.5" r="1"/><path d="M5 17v2M19 17v2"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  okc: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  cloud: '<path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/>',
  money: '<path d="M12 3v18M17 7H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H6"/>',
};
const ic = (n, s = 20) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON[n]}</svg>`;
$$('[data-i]').forEach(el => el.outerHTML = ic(el.dataset.i, 22));

let toastT;
function toast(msg, ms = 2600) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), ms); }

/* ===================== dados fixos ===================== */
const CHECKLIST = [
  { id: 'motor', nome: 'Motor e Arrefecimento', itens: ['Nível e estado do óleo do motor', 'Líquido de arrefecimento', 'Vazamentos de óleo ou água', 'Correias e tensores', 'Funcionamento do motor', 'Ruídos anormais', 'Filtro de ar'] },
  { id: 'cambio', nome: 'Câmbio e Transmissão', itens: ['Embreagem', 'Trocas de marcha', 'Ruídos na transmissão', 'Vazamentos no câmbio'] },
  { id: 'freios', nome: 'Freios', itens: ['Pastilhas dianteiras', 'Pastilhas / lonas traseiras', 'Discos de freio', 'Fluido de freio', 'Freio de estacionamento'] },
  { id: 'susp', nome: 'Suspensão e Direção', itens: ['Amortecedores', 'Bandejas e buchas', 'Terminais e barras', 'Folga na direção', 'Coifas e homocinéticas', 'Alinhamento aparente'] },
  { id: 'pneus', nome: 'Pneus e Rodas', itens: ['Pneu dianteiro esquerdo', 'Pneu dianteiro direito', 'Pneu traseiro esquerdo', 'Pneu traseiro direito', 'Estepe', 'Rodas e calotas'] },
  { id: 'eletrica', nome: 'Elétrica e Iluminação', itens: ['Bateria', 'Faróis', 'Lanternas e luz de freio', 'Setas e pisca-alerta', 'Painel e luzes de alerta', 'Ar-condicionado'] },
];
const ckKey = (c, i) => c.id + '_' + i;
const CK_TOTAL = CHECKLIST.reduce((a, c) => a + c.itens.length, 0);
const ST = { ok: 'OK', at: 'Atenção', rp: 'Reprovado' };
const FUEL = ['Reserva', '1/4', 'Meio', '3/4', 'Cheio'];
const STEPS = ['Dados', 'Checklist', 'Fotos', 'Serviços', 'Assinaturas', 'Finalizar'];
const SUGEST = ['Troca de óleo', 'Filtro de óleo', 'Filtro de ar', 'Pastilhas de freio', 'Alinhamento e balanceamento', 'Diagnóstico eletrônico', 'Mão de obra'];

/* ===================== configurações (localStorage) ===================== */
const CFG_KEY = 'os_cfg';
const CFG_DEF = { nome: 'EG Garage', sub: 'Oficina Mecânica', cnpj: '', telefone: '', email: '', endereco: '', responsavel: 'Enzo Giovanne', prox: 1, logo: '', logoW: 0, logoH: 0 };
let cfg = { ...CFG_DEF };
try { Object.assign(cfg, JSON.parse(localStorage.getItem(CFG_KEY) || '{}')); } catch (e) { }
function saveCfg(fromCloud) {
  if (!fromCloud) { cfg._u = new Date().toISOString(); if (Cloud.on) { Cloud.cfgDirty(); syncLater(); } }
  try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (e) { toast('Não foi possível salvar as configurações'); }
}
let syncT;
function syncLater(ms = 1500) { if (!Cloud.on) return; clearTimeout(syncT); syncT = setTimeout(() => Cloud.sync().then(afterSync), ms); }
function afterSync(changed) {
  // atualiza a tela com dados vindos de outros aparelhos (nunca no meio do preenchimento de uma OS)
  if (changed && !document.body.classList.contains('wz') && !document.querySelector('input:focus,textarea:focus')) render();
}

/* ===================== banco (IndexedDB) ===================== */
const DB = (() => {
  let p;
  const open = () => p ||= new Promise((res, rej) => {
    const r = indexedDB.open('oficina-os', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('ordens', { keyPath: 'id' });
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
  const tx = async (mode, fn) => {
    const db = await open();
    return new Promise((res, rej) => {
      const t = db.transaction('ordens', mode); const req = fn(t.objectStore('ordens'));
      t.oncomplete = () => res(req?.result); t.onerror = () => rej(t.error);
    });
  };
  return {
    all: async () => (await tx('readonly', s => s.getAll())).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    get: id => tx('readonly', s => s.get(id)),
    put: o => tx('readwrite', s => s.put(o)),
    del: id => tx('readwrite', s => s.delete(id)),
    clear: () => tx('readwrite', s => s.clear()),
  };
})();

/* ===================== modelo da OS ===================== */
function newOrder() {
  const now = new Date().toISOString();
  return {
    id: uid(), numero: null, createdAt: now, updatedAt: now, status: 'andamento', concluidaEm: null,
    cliente: { nome: '', telefone: '', email: '', doc: '' },
    veiculo: { modelo: '', placa: '', ano: '', km: '', cor: '', combustivel: 'Meio' },
    responsavel: cfg.responsavel, previsao: '', reclamacao: '',
    checklist: {}, fotos: [], avarias: '', servicos: [], desconto: 0, obs: '',
    assCliente: null, assResp: null,
  };
}
function totals(o) {
  let serv = 0, pecas = 0;
  o.servicos.forEach(s => { const t = num(s.qtd) * num(s.valor); s.tipo === 'peca' ? pecas += t : serv += t; });
  const desc = num(o.desconto);
  return { serv, pecas, desc, total: Math.max(0, serv + pecas - desc) };
}
function ckCounts(o) {
  const c = { ok: 0, at: 0, rp: 0 };
  Object.values(o.checklist).forEach(v => { if (c[v] !== undefined) c[v]++; });
  c.feitos = c.ok + c.at + c.rp; return c;
}
function resultado(o) {
  const c = ckCounts(o);
  if (!c.feitos) return { cls: 'nv', txt: 'Sem inspeção', sub: 'Checklist não preenchido' };
  if (c.rp) return { cls: 'rp', txt: 'REPROVADO', sub: `${c.rp} item(ns) necessitam reparo` };
  if (c.at) return { cls: 'at', txt: 'APROVADO COM RESSALVAS', sub: `${c.at} item(ns) requerem atenção` };
  return { cls: 'ok', txt: 'APROVADO', sub: 'Sem pendências graves' };
}
const statusChip = o => o.status === 'concluida' ? '<span class="chip concluida">Concluída</span>' : '<span class="chip andamento">Em andamento</span>';

/* ===================== estado / roteamento ===================== */
const state = { draft: null, step: 0, pdf: {}, justDone: null, filtro: 'todas' };
const view = $('#view');
$('#brand').innerHTML = brandHTML();
function brandHTML() { const [a, ...b] = (cfg.nome || 'Oficina').split(' '); return `<div class="logo"><b>${esc(a)}</b>${b.length ? ' ' + esc(b.join(' ')) : ''}<small>${esc(cfg.sub)}</small></div>`; }

function setTop(title, back) {
  $('#title').textContent = title;
  const b = $('#back'); b.hidden = !back; b.innerHTML = ic('back', 24);
  b.onclick = back ? (typeof back === 'function' ? back : () => location.hash = back) : null;
}
async function render() {
  const [r, arg] = (location.hash.slice(2) || 'inicio').split('/');
  if (Cloud.on && !Cloud.user) return vLogin();
  document.body.className = '';
  $$('#tabbar a').forEach(a => a.classList.toggle('on', a.dataset.r === r));
  window.scrollTo(0, 0);
  try {
    switch (r) {
      case 'inicio': return await vHome();
      case 'nova': return await vNova();
      case 'editar': return await vEditar(arg);
      case 'ordens': return await vOrdens(decodeURIComponent(arg || ''));
      case 'os': return await vOS(arg);
      case 'clientes': return await vClientes();
      case 'config': return vConfig();
      default: location.hash = '#/inicio';
    }
  } catch (e) { console.error(e); view.innerHTML = `<div class="empty">Ocorreu um erro: ${esc(e.message)}</div>`; }
}
window.addEventListener('hashchange', render);

function itemHTML(o) {
  const f = o.fotos[0];
  return `<a class="item" href="#/os/${o.id}">
    <div class="thumb" ${f ? `style="background-image:url(${f.data})"` : ''}>${f ? '' : ic('car', 24)}</div>
    <div class="info"><b>${esc(o.veiculo.modelo || 'Veículo')} · ${esc((o.veiculo.placa || '').toUpperCase())}</b>
    <small>OS ${numFmt(o.numero)} · ${esc(o.cliente.nome)}</small><small>${fmtDateTime(o.createdAt)}</small></div>
    ${statusChip(o)}</a>`;
}

/* ===================== INÍCIO ===================== */
async function vHome() {
  document.body.classList.add('home'); setTop('Início');
  const all = await DB.all(), now = new Date();
  const hoje = all.filter(o => sameDay(o.createdAt, now)).length;
  const and = all.filter(o => o.status !== 'concluida');
  const conc = all.filter(o => o.status === 'concluida');
  const mes = conc.filter(o => { const d = new Date(o.concluidaEm || o.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
    .reduce((a, o) => a + totals(o).total, 0);
  const h = now.getHours(), saud = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  view.innerHTML = `
    <div class="hello"><h2>${saud}, ${esc((cfg.responsavel || '').split(' ')[0] || 'equipe')}! 👋</h2><p>Controle total da sua oficina.</p></div>
    <div class="stats">
      <div class="stat s1">${ic('car', 24)}<small>Entradas hoje</small><b>${hoje}</b></div>
      <div class="stat s2">${ic('wrench', 24)}<small>Em serviço</small><b>${and.length}</b></div>
      <div class="stat s3">${ic('okc', 24)}<small>Concluídas</small><b>${conc.length}</b></div>
      <div class="stat s4">${ic('money', 24)}<small>Faturado no mês</small><b style="font-size:18px;margin-top:6px">${brl(mes)}</b></div>
    </div>
    <a class="btn red cta" href="#/nova">${ic('plus', 20)} Nova Ordem de Serviço</a>
    ${and.length ? `<h3 class="sec">Em andamento</h3><div class="list">${and.slice(0, 4).map(itemHTML).join('')}</div>` : ''}
    <h3 class="sec">Últimas ordens <a href="#/ordens">Ver todas ${''}</a></h3>
    <div class="list">${all.slice(0, 6).map(itemHTML).join('') || '<div class="empty">Nenhuma OS ainda. Toque em “Nova Ordem de Serviço”.</div>'}</div>`;
}

/* ===================== LISTA DE ORDENS ===================== */
async function vOrdens(q0) {
  setTop('Ordens de Serviço');
  const all = await DB.all();
  view.innerHTML = `
    <label class="search">${ic('search', 18)}<input class="inp" id="q" placeholder="Buscar cliente, placa ou veículo..." value="${esc(q0)}"></label>
    <div class="filters">${[['todas', 'Todas'], ['andamento', 'Em andamento'], ['concluida', 'Concluídas']].map(([k, t]) => `<button data-fl="${k}" class="${state.filtro === k ? 'on' : ''}">${t}</button>`).join('')}</div>
    <div class="list" id="lst"></div>`;
  const draw = () => {
    const q = $('#q').value.trim().toLowerCase();
    const l = all.filter(o => (state.filtro === 'todas' || o.status === state.filtro) &&
      (!q || [o.cliente.nome, o.veiculo.placa, o.veiculo.modelo, o.cliente.telefone, numFmt(o.numero)].join(' ').toLowerCase().includes(q)));
    $('#lst').innerHTML = l.map(itemHTML).join('') || '<div class="empty">Nenhuma ordem encontrada.</div>';
  };
  $('#q').oninput = draw;
  $$('[data-fl]').forEach(b => b.onclick = () => { state.filtro = b.dataset.fl; $$('[data-fl]').forEach(x => x.classList.toggle('on', x === b)); draw(); });
  draw();
}

/* ===================== CLIENTES ===================== */
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const cliKey = c => String(c.telefone || '').replace(/\D/g, '') || norm(c.nome);
const veiTxt = v => `${v.modelo || 'Veículo'}${v.placa ? ' · ' + v.placa : ''}`;
// Monta a lista de clientes a partir das OS (mais recentes primeiro), com os veículos de cada um
async function clientesIndex() {
  const all = await DB.all(), map = new Map();
  all.forEach(o => {
    if (state.draft && o.id === state.draft.id) return;
    const k = cliKey(o.cliente); if (!k) return;
    let c = map.get(k);
    if (!c) { c = { key: k, ...o.cliente, ult: o.createdAt, n: 0, veiculos: new Map() }; map.set(k, c); }
    c.n++;
    ['email', 'doc'].forEach(f => { if (!c[f] && o.cliente[f]) c[f] = o.cliente[f]; });
    const placa = (o.veiculo.placa || '').toUpperCase().trim(), vk = placa || norm(o.veiculo.modelo);
    if (vk && !c.veiculos.has(vk)) c.veiculos.set(vk, { ...o.veiculo, placa });
  });
  return [...map.values()];
}
function cliBusca(lst, q) {
  q = norm(q); const qd = q.replace(/\D/g, '');
  return lst.filter(c => !q || norm(c.nome).includes(q) || (qd.length >= 3 && String(c.telefone).replace(/\D/g, '').includes(qd)) ||
    [...c.veiculos.values()].some(v => norm(v.placa).includes(q) || norm(v.modelo).includes(q)));
}
const avatar = (nome, s = 46) => `<div class="thumb avatar" style="width:${s}px;height:${s}px">${esc((nome || '?').trim().charAt(0).toUpperCase())}</div>`;

async function vClientes() {
  setTop('Clientes');
  const lst = await clientesIndex();
  view.innerHTML = `
    <label class="search">${ic('search', 18)}<input class="inp" id="q" placeholder="Buscar cliente, telefone ou placa..."></label>
    <div class="list" id="lst"></div>`;
  const draw = () => {
    $('#lst').innerHTML = cliBusca(lst, $('#q').value).map(c => `
      <div class="item" data-ver="${esc(c.nome)}">
        ${avatar(c.nome)}
        <div class="info"><b>${esc(c.nome)}</b><small>${esc([...c.veiculos.values()].map(veiTxt).join(', '))}</small><small>${esc(c.telefone)} · ${c.n} OS · última ${fmtDate(c.ult)}</small></div>
        <button class="btn red sm" data-nova="${esc(c.key)}">${ic('plus', 16)} OS</button></div>`).join('')
      || '<div class="empty">Nenhum cliente encontrado.</div>';
  };
  $('#lst').onclick = e => {
    const nb = e.target.closest('[data-nova]');
    if (nb) { state.preCli = nb.dataset.nova; state.draft = null; location.hash = '#/nova'; return; }
    const it = e.target.closest('[data-ver]'); if (it) location.hash = '#/ordens/' + encodeURIComponent(it.dataset.ver);
  };
  $('#q').oninput = draw; draw();
}

/* ===================== WIZARD NOVA / EDITAR ===================== */
async function vNova() {
  if (!state.draft || state.draft.numero) {
    state.draft = newOrder(); state.step = 0; state.modoNovo = true;
    state.cliSel = state.veiSel = null; state.ultKm = '';
    if (state.preCli) {
      const c = (await clientesIndex()).find(x => x.key === state.preCli);
      if (c) aplicaCliente(state.draft, c);
    }
  }
  state.preCli = null;
  wizard();
}
async function vEditar(id) {
  if (!state.draft || state.draft.id !== id) {
    const o = await DB.get(id); if (!o) return location.hash = '#/ordens';
    state.draft = o; state.step = 0; state.modoNovo = false; state.ultKm = '';
  }
  wizard();
}
function aplicaCliente(o, c) {
  o.cliente = { nome: c.nome || '', telefone: c.telefone || '', email: c.email || '', doc: c.doc || '' };
  state.cliSel = c.key; state.veiSel = null;
  const vs = [...c.veiculos.values()];
  if (vs.length === 1) aplicaVeiculo(o, vs[0]); else limpaVeiculo(o);
}
function aplicaVeiculo(o, v) {
  o.veiculo = { modelo: v.modelo || '', placa: v.placa || '', ano: v.ano || '', cor: v.cor || '', km: '', combustivel: o.veiculo.combustivel };
  state.veiSel = v.placa || v.modelo; state.ultKm = v.km || '';
}
function limpaVeiculo(o) {
  o.veiculo = { modelo: '', placa: '', ano: '', cor: '', km: '', combustivel: o.veiculo.combustivel };
  state.veiSel = ''; state.ultKm = '';
}
async function persist() {
  const o = state.draft;
  if (!o.numero) {
    const maxN = (await DB.all()).reduce((m, x) => Math.max(m, x.numero || 0), 0);
    o.numero = Math.max(cfg.prox, maxN + 1); cfg.prox = o.numero + 1; saveCfg();
  }
  o._dirty = true;
  o.veiculo.placa = (o.veiculo.placa || '').toUpperCase().trim();
  o.updatedAt = new Date().toISOString();
  await DB.put(o);
  syncLater();
}
function validaDados() {
  const o = state.draft; let ok = true;
  $$('[data-req]').forEach(el => { const v = (getPath(o, el.dataset.f) || '').trim(); el.closest('.fld').classList.toggle('err', !v); if (!v) ok = false; });
  if (!ok) toast('Preencha nome do cliente, veículo e placa');
  return ok;
}
async function goStep(n) {
  if (state.step === 0 && n > 0 && !validaDados()) return;
  await persist(); state.step = n; wizard(); window.scrollTo(0, 0);
}

const field = (label, f, { type = 'text', ph = '', req = false, mode = '', cls = '', up = false } = {}) =>
  `<label class="fld ${cls}"><span>${label}</span><input type="${type}" data-f="${f}" value="${esc(getPath(state.draft, f))}" placeholder="${esc(ph)}"
   ${mode ? `inputmode="${mode}"` : ''} ${req ? 'data-req' : ''} ${up ? 'class="up" autocapitalize="characters"' : ''}></label>`;
const area = (label, f, ph = '') => `<label class="fld"><span>${label}</span><textarea data-f="${f}" rows="3" placeholder="${esc(ph)}">${esc(getPath(state.draft, f))}</textarea></label>`;

function wizard() {
  const o = state.draft, s = state.step;
  document.body.classList.add('wz');
  $$('#tabbar a').forEach(a => a.classList.remove('on'));
  setTop(o.numero ? `OS ${numFmt(o.numero)} · ${STEPS[s]}` : 'Nova Ordem de Serviço', () => s > 0 ? goStep(s - 1) : sairWizard());
  view.innerHTML = `
    <div class="steps">${STEPS.map((t, i) => `<button class="stp ${i < s ? 'done' : ''} ${i === s ? 'cur' : ''}" data-go="${i}"><span>${i < s ? ic('check', 14) : i + 1}</span><small>${t}</small></button>`).join('')}</div>
    <div id="wzb">${[stDados, stCheck, stFotos, stServ, stAss, stFim][s](o)}</div>
    <div class="wz-foot"><button class="btn ghost" id="wzPrev">${s ? 'Voltar' : 'Cancelar'}</button>
    ${s < 5 ? `<button class="btn red" id="wzNext">Próximo ${ic('chev', 18)}</button>` : `<button class="btn green" id="wzFin">${ic('check', 18)} Finalizar OS</button>`}</div>`;
  $$('[data-f]').forEach(el => el.addEventListener('input', () => { setPath(o, el.dataset.f, el.value); el.closest('.fld')?.classList.remove('err'); }));
  $$('[data-go]').forEach(b => b.onclick = () => goStep(+b.dataset.go));
  $('#wzPrev').onclick = () => s ? goStep(s - 1) : sairWizard();
  if (s < 5) $('#wzNext').onclick = () => goStep(s + 1); else $('#wzFin').onclick = finalizar;
  [bDados, bCheck, bFotos, bServ, bAss, () => { }][s](o);
}
async function sairWizard() {
  const o = state.draft;
  if (o.numero) { await persist(); state.draft = null; location.hash = '#/os/' + o.id; return; }
  if (o.cliente.nome || o.veiculo.modelo) { if (!confirm('Descartar esta nova OS?')) return; }
  state.draft = null; location.hash = '#/inicio';
}

/* --- passo 1: dados --- */
function stDados(o) {
  return `
  ${state.modoNovo ? `<div class="card cli-box" id="cliBox"><div class="empty sm">Carregando clientes...</div></div>` : ''}
  <h3 class="sec">Cliente</h3>
  <div class="card form">
    ${field('Nome do cliente *', 'cliente.nome', { req: true, ph: 'Ex: João da Silva' })}
    <div class="grid2">
      ${field('WhatsApp / Telefone', 'cliente.telefone', { type: 'tel', mode: 'tel', ph: '(11) 99999-9999' })}
      ${field('CPF / CNPJ', 'cliente.doc', { mode: 'numeric' })}
    </div>
    ${field('E-mail', 'cliente.email', { type: 'email', ph: 'cliente@email.com' })}
  </div>
  <h3 class="sec">Veículo</h3>
  <div class="card form">
    ${field('Marca / Modelo *', 'veiculo.modelo', { req: true, ph: 'Ex: Volkswagen Golf GTI' })}
    <div class="grid2">
      ${field('Placa *', 'veiculo.placa', { req: true, up: true, ph: 'ABC1D23' })}
      ${field('Ano', 'veiculo.ano', { mode: 'numeric', ph: '2017' })}
      ${field('Quilometragem', 'veiculo.km', { mode: 'numeric', ph: state.ultKm ? 'Última: ' + state.ultKm : '78.250' })}
      ${field('Cor', 'veiculo.cor', { ph: 'Preto' })}
    </div>
    <div class="fld"><span>Nível de combustível</span><div class="seg">${FUEL.map(f => `<button type="button" data-fuel="${f}" class="${o.veiculo.combustivel === f ? 'on' : ''}">${f}</button>`).join('')}</div></div>
  </div>
  <h3 class="sec">Atendimento</h3>
  <div class="card form">
    <div class="grid2">
      ${field('Responsável', 'responsavel')}
      ${field('Previsão de entrega', 'previsao', { type: 'date' })}
    </div>
    ${area('Reclamação / solicitação do cliente', 'reclamacao', 'Ex: barulho na suspensão dianteira, revisão dos 80 mil km...')}
  </div>`;
}
function bDados(o) {
  $$('[data-fuel]').forEach(b => b.onclick = () => { o.veiculo.combustivel = b.dataset.fuel; $$('[data-fuel]').forEach(x => x.classList.toggle('on', x === b)); });
  const box = $('#cliBox'); if (!box) return;
  clientesIndex().then(lst => {
    if (!box.isConnected) return;
    const c = state.cliSel && lst.find(x => x.key === state.cliSel);
    if (c) {
      // cliente escolhido: mostra os veículos dele
      const vs = [...c.veiculos.values()];
      box.innerHTML = `
        <div class="row">${avatar(c.nome, 42)}<div class="info" style="flex:1;min-width:0"><b>${esc(c.nome)}</b><small>${esc(c.telefone || 'sem telefone')} · ${c.n} OS anteriores</small></div>
        <button type="button" class="btn ghost sm" id="cliTroca">Trocar</button></div>
        <div class="cli-lbl">Veículos do cliente — selecione um:</div>
        <div class="vchips">${vs.map(v => `<button type="button" data-vei="${esc(v.placa || v.modelo)}" class="${state.veiSel === (v.placa || v.modelo) ? 'on' : ''}">${ic('car', 16)} ${esc(veiTxt(v))}</button>`).join('')}
        <button type="button" data-vei="" class="${state.veiSel === '' ? 'on' : ''}">${ic('plus', 16)} Outro veículo</button></div>`;
      $('#cliTroca').onclick = () => { o.cliente = { nome: '', telefone: '', email: '', doc: '' }; limpaVeiculo(o); state.cliSel = state.veiSel = null; wizard(); $('#cliQ')?.focus(); };
      $$('[data-vei]', box).forEach(b => b.onclick = () => {
        const v = vs.find(x => (x.placa || x.modelo) === b.dataset.vei);
        v ? aplicaVeiculo(o, v) : limpaVeiculo(o); wizard();
        if (!v) $('[data-f="veiculo.modelo"]').focus();
      });
      return;
    }
    // sem cliente escolhido: campo de busca
    box.innerHTML = `
      <div class="cli-lbl" style="margin-top:0">${ic('users', 16)} Cliente já cadastrado?</div>
      <label class="search" style="margin:0">${ic('search', 18)}<input class="inp" id="cliQ" autocomplete="off" placeholder="Buscar por nome, telefone ou placa"></label>
      <div class="list" id="cliRes" style="margin-top:8px"></div>
      <div class="cli-lbl" style="margin-bottom:0">${lst.length ? 'Ou preencha abaixo para cadastrar um <b>novo cliente</b>.' : 'Nenhum cliente cadastrado ainda — preencha abaixo para cadastrar.'}</div>`;
    const draw = () => {
      const q = $('#cliQ').value;
      $('#cliRes').innerHTML = !q.trim() ? '' : cliBusca(lst, q).slice(0, 6).map(c => `
        <button type="button" class="item cli-it" data-cli="${esc(c.key)}">${avatar(c.nome, 38)}
        <div class="info"><b>${esc(c.nome)}</b><small>${esc([...c.veiculos.values()].map(veiTxt).join(', ') || c.telefone)}</small></div>${ic('chev', 18)}</button>`).join('')
        || '<div class="empty sm" style="padding:8px">Nenhum cliente encontrado.</div>';
    };
    $('#cliQ').oninput = draw;
    $('#cliRes').onclick = e => { const b = e.target.closest('[data-cli]'); if (!b) return; aplicaCliente(o, lst.find(x => x.key === b.dataset.cli)); wizard(); };
  });
}

/* --- passo 2: checklist --- */
function stCheck(o) {
  const c = ckCounts(o);
  return `
  <div class="prog"><div id="pg" style="width:${c.feitos / CK_TOTAL * 100}%"></div></div>
  <div class="prog-t"><span id="pgt">${c.feitos}/${CK_TOTAL} itens verificados</span><button class="lnk" id="ckAll" style="margin:0;padding:0;color:var(--red2)">Marcar restantes OK</button></div>
  <div class="legend"><span><i style="background:var(--green)"></i>OK – bom estado</span><span><i style="background:var(--yellow)"></i>! – atenção</span><span><i style="background:var(--red)"></i>✕ – reprovado</span></div>
  ${CHECKLIST.map((cat, ci) => `
    <details class="acc" ${ci === 0 ? 'open' : ''}>
      <summary>${ic('wrench', 18)}<span>${cat.nome}</span><span class="cnt" data-cnt="${cat.id}"></span>${ic('chev', 18).replace('class="ic"', 'class="ic chev"')}</summary>
      ${cat.itens.map((it, i) => { const k = ckKey(cat, i), st = o.checklist[k]; return `
        <div class="ck"><span class="ck-n">${it}</span><div class="ck-b">
          ${['ok', 'at', 'rp'].map(x => `<button type="button" class="${x} ${st === x ? 'on' : ''}" data-ck="${k}" data-st="${x}" title="${ST[x]}">${x === 'ok' ? 'OK' : x === 'at' ? '!' : '✕'}</button>`).join('')}
        </div></div>`; }).join('')}
    </details>`).join('')}`;
}
function bCheck(o) {
  const refresh = () => {
    const c = ckCounts(o);
    $('#pg').style.width = c.feitos / CK_TOTAL * 100 + '%'; $('#pgt').textContent = `${c.feitos}/${CK_TOTAL} itens verificados`;
    CHECKLIST.forEach(cat => { const n = cat.itens.filter((_, i) => o.checklist[ckKey(cat, i)]).length; $(`[data-cnt="${cat.id}"]`).textContent = `${n}/${cat.itens.length}`; });
    $$('[data-ck]').forEach(b => b.classList.toggle('on', o.checklist[b.dataset.ck] === b.dataset.st));
  };
  $('#wzb').addEventListener('click', ev => {
    const b = ev.target.closest('[data-ck]'); if (!b) return;
    const k = b.dataset.ck; o.checklist[k] = o.checklist[k] === b.dataset.st ? undefined : b.dataset.st;
    if (!o.checklist[k]) delete o.checklist[k];
    refresh();
  });
  $('#ckAll').onclick = () => { CHECKLIST.forEach(cat => cat.itens.forEach((_, i) => { const k = ckKey(cat, i); if (!o.checklist[k]) o.checklist[k] = 'ok'; })); refresh(); };
  refresh();
}

/* --- passo 3: fotos --- */
function stFotos(o) {
  return `
  <p class="hint">Registre fotos das avarias e do estado geral do veículo. Todas as fotos serão incluídas no PDF da OS.</p>
  <div class="ph-actions">
    <label class="btn red">${ic('camera')} Câmera<input type="file" accept="image/*" capture="environment" hidden id="phCam"></label>
    <label class="btn ghost">${ic('image')} Galeria<input type="file" accept="image/*" multiple hidden id="phGal"></label>
  </div>
  <div class="ph-grid">${o.fotos.map((f, i) => `
    <div class="ph"><img src="${f.data}" alt=""><span class="ph-n">${i + 1}</span>
    <button type="button" class="ph-del" data-del="${i}" aria-label="Remover">${ic('trash', 16)}</button>
    <input placeholder="Legenda (ex: risco no para-choque)" data-leg="${i}" value="${esc(f.legenda)}"></div>`).join('')
    || '<div class="empty sm">Nenhuma foto adicionada ainda</div>'}</div>
  <div class="card form">${area('Avarias existentes na entrada', 'avarias', 'Ex: leve risco no para-choque dianteiro, retrovisor esquerdo trincado...')}</div>`;
}
function compress(file, max = 1280, q = 0.72) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * s), h = Math.round(img.height * s);
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url); res({ data: c.toDataURL('image/jpeg', q), w, h });
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('Imagem inválida')); };
    img.src = url;
  });
}
function bFotos(o) {
  const add = async e => {
    const files = [...e.target.files]; if (!files.length) return;
    toast(`Processando ${files.length} foto(s)...`);
    for (const f of files) { try { o.fotos.push({ ...(await compress(f)), legenda: '', path: `${o.id}/${uid()}.jpg` }); } catch (err) { toast('Falha ao ler uma imagem'); } }
    await persist(); wizard();
  };
  $('#phCam').onchange = add; $('#phGal').onchange = add;
  $$('[data-del]').forEach(b => b.onclick = async () => { if (!confirm('Remover esta foto?')) return; const [rm] = o.fotos.splice(+b.dataset.del, 1); Cloud.removePhoto(rm?.path); await persist(); wizard(); });
  $$('[data-leg]').forEach(i => i.oninput = () => o.fotos[+i.dataset.leg].legenda = i.value);
}

/* --- passo 4: serviços --- */
function stServ(o) {
  const t = totals(o);
  return `
  <div id="svl">${o.servicos.map((s, i) => `
    <div class="card sv">
      <div class="sv-top"><select class="inp" data-sv="${i}" data-k="tipo"><option value="servico" ${s.tipo !== 'peca' ? 'selected' : ''}>Serviço / mão de obra</option><option value="peca" ${s.tipo === 'peca' ? 'selected' : ''}>Peça</option></select>
      <button type="button" class="icon-btn" data-svdel="${i}" aria-label="Remover">${ic('trash', 18)}</button></div>
      <input class="inp" data-sv="${i}" data-k="desc" placeholder="Descrição" value="${esc(s.desc)}">
      <div class="grid2">
        <label class="fld"><span>Quantidade</span><input type="number" inputmode="decimal" min="0" step="any" data-sv="${i}" data-k="qtd" value="${esc(s.qtd)}"></label>
        <label class="fld"><span>Valor unitário (R$)</span><input type="number" inputmode="decimal" min="0" step="0.01" data-sv="${i}" data-k="valor" value="${esc(s.valor)}" placeholder="0,00"></label>
      </div>
      <div class="sv-tot">Subtotal: <b data-svt="${i}">${brl(num(s.qtd) * num(s.valor))}</b></div>
    </div>`).join('') || '<div class="empty" style="padding:14px">Nenhum serviço ou peça lançado.</div>'}</div>
  <button type="button" class="btn ghost" style="width:100%" id="svAdd">${ic('plus', 18)} Adicionar serviço / peça</button>
  <div class="chips">${SUGEST.map(s => `<button type="button" data-sug="${esc(s)}">+ ${esc(s)}</button>`).join('')}</div>
  <div class="card totals">
    <div class="row"><span>Serviços</span><b id="tS">${brl(t.serv)}</b></div>
    <div class="row"><span>Peças</span><b id="tP">${brl(t.pecas)}</b></div>
    <div class="row"><span>Desconto (R$)</span><input class="inp" type="number" inputmode="decimal" min="0" step="0.01" id="desc" value="${esc(o.desconto || '')}" placeholder="0,00"></div>
    <div class="row tot"><span>Total</span><b id="tT">${brl(t.total)}</b></div>
  </div>
  <h3 class="sec">Observações técnicas</h3>
  <div class="card form">${area('Diagnóstico / recomendações', 'obs', 'Ex: recomendada troca das pastilhas traseiras em até 3.000 km...')}</div>`;
}
function bServ(o) {
  const upd = () => {
    const t = totals(o); $('#tS').textContent = brl(t.serv); $('#tP').textContent = brl(t.pecas); $('#tT').textContent = brl(t.total);
    o.servicos.forEach((s, i) => { const el = $(`[data-svt="${i}"]`); if (el) el.textContent = brl(num(s.qtd) * num(s.valor)); });
  };
  const add = (desc = '') => { o.servicos.push({ tipo: /filtro|pastilha|óleo$/i.test(desc) && !/troca|mão/i.test(desc) ? 'peca' : 'servico', desc, qtd: 1, valor: '' }); wizard(); $$('[data-k="valor"]').pop()?.focus(); };
  $('#svAdd').onclick = () => add();
  $$('[data-sug]').forEach(b => b.onclick = () => add(b.dataset.sug));
  $$('[data-sv]').forEach(el => el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => { o.servicos[+el.dataset.sv][el.dataset.k] = el.value; upd(); }));
  $$('[data-svdel]').forEach(b => b.onclick = () => { o.servicos.splice(+b.dataset.svdel, 1); wizard(); });
  $('#desc').oninput = e => { o.desconto = e.target.value; upd(); };
}

/* --- passo 5: assinaturas --- */
function stAss(o) {
  const pad = (k, t, n) => `<div class="sig-wrap"><div class="sig-h"><b>${t}</b><span>${esc(n)}</span></div>
    <canvas class="sig" data-sig="${k}"></canvas><button type="button" class="lnk" data-clr="${k}">${ic('trash', 14)} Limpar</button></div>`;
  return `<p class="hint">Peça para o cliente assinar com o dedo na área branca.</p>
    ${pad('assCliente', 'Assinatura do Cliente', o.cliente.nome)}${pad('assResp', 'Assinatura do Responsável', o.responsavel)}`;
}
function bAss(o) {
  $$('canvas[data-sig]').forEach(cv => {
    const k = cv.dataset.sig, r = window.devicePixelRatio || 1, box = cv.getBoundingClientRect();
    cv.width = Math.round(box.width * r); cv.height = Math.round(box.height * r);
    const x = cv.getContext('2d');
    const reset = () => { x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = '#fff'; x.fillRect(0, 0, cv.width, cv.height); x.setTransform(r, 0, 0, r, 0, 0); x.lineWidth = 2.4; x.lineCap = x.lineJoin = 'round'; x.strokeStyle = '#111'; };
    reset();
    if (o[k]?.data) { const im = new Image(); im.onload = () => { x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(im, 0, 0, cv.width, cv.height); x.setTransform(r, 0, 0, r, 0, 0); }; im.src = o[k].data; }
    let drawing = false, last;
    const pos = e => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    cv.onpointerdown = e => { drawing = true; cv.setPointerCapture(e.pointerId); last = pos(e); x.beginPath(); x.arc(last[0], last[1], 1.1, 0, 7); x.fillStyle = '#111'; x.fill(); };
    cv.onpointermove = e => { if (!drawing) return; const p = pos(e); x.beginPath(); x.moveTo(...last); x.lineTo(...p); x.stroke(); last = p; };
    cv.onpointerup = cv.onpointercancel = () => { if (!drawing) return; drawing = false; o[k] = { data: cv.toDataURL('image/png'), w: cv.width, h: cv.height }; };
    $(`[data-clr="${k}"]`).onclick = () => { reset(); o[k] = null; };
  });
}

/* --- passo 6: finalizar --- */
function resumoHTML(o) {
  const c = ckCounts(o), r = resultado(o), t = totals(o);
  return `
  <div class="res ${r.cls}">${ic(r.cls === 'ok' ? 'okc' : r.cls === 'nv' ? 'list' : 'clock', 30)}<div><b>${r.txt}</b><small>${r.sub}</small></div></div>
  <div class="counts"><div class="c-ok"><b>${c.ok}</b><small>Em bom estado</small></div><div class="c-at"><b>${c.at}</b><small>Atenção</small></div><div class="c-rp"><b>${c.rp}</b><small>Reprovados</small></div></div>`;
}
function stFim(o) {
  const t = totals(o);
  return `
  ${resumoHTML(o)}
  <h3 class="sec">Resumo</h3>
  <div class="card"><dl class="kv">
    <dt>Cliente</dt><dd>${esc(o.cliente.nome)}</dd>
    <dt>Contato</dt><dd>${esc(o.cliente.telefone || '-')}<br>${esc(o.cliente.email || '')}</dd>
    <dt>Veículo</dt><dd>${esc(o.veiculo.modelo)} · ${esc(o.veiculo.placa.toUpperCase())}</dd>
    <dt>Fotos</dt><dd>${o.fotos.length}</dd>
    <dt>Serviços/peças</dt><dd>${o.servicos.length} item(ns)</dd>
    <dt>Assinaturas</dt><dd>${o.assCliente ? 'Cliente ✓' : 'Cliente ✗'} · ${o.assResp ? 'Responsável ✓' : 'Responsável ✗'}</dd>
    <dt style="font-size:16px;color:var(--text)">Total</dt><dd style="font-size:18px;color:var(--red2)">${brl(t.total)}</dd>
  </dl></div>
  <p class="note">Ao finalizar, a OS é marcada como concluída e o PDF com todas as fotos fica pronto para enviar ao cliente por WhatsApp ou e-mail.</p>`;
}
async function finalizar() {
  const o = state.draft;
  if (!o.assCliente && !confirm('O cliente ainda não assinou. Finalizar mesmo assim?')) return;
  o.status = 'concluida'; o.concluidaEm = new Date().toISOString();
  await persist();
  state.draft = null; state.justDone = o.id;
  location.hash = '#/os/' + o.id;
}

/* ===================== DETALHE DA OS ===================== */
async function vOS(id) {
  const o = await DB.get(id); if (!o) return location.hash = '#/ordens';
  setTop('OS ' + numFmt(o.numero), '#/ordens');
  const t = totals(o), done = state.justDone === id; state.justDone = null;
  view.innerHTML = `
  ${done ? `<div class="done-banner">${ic('okc', 34)}<div><b>OS finalizada com sucesso!</b><small>Envie a cópia em PDF para o cliente.</small></div></div>` : ''}
  <div class="card os-head">
    <div class="thumb" style="width:84px;height:66px;${o.fotos[0] ? `background-image:url(${o.fotos[0].data})` : ''}">${o.fotos[0] ? '' : ic('car', 28)}</div>
    <div style="flex:1;min-width:0"><div class="num">OS Nº ${numFmt(o.numero)} · ${fmtDate(o.createdAt)}</div>
    <h2>${esc(o.veiculo.modelo)}</h2><span class="plate">${esc(o.veiculo.placa)}</span> ${statusChip(o)}</div>
  </div>
  <h3 class="sec">Enviar cópia ao cliente</h3>
  <div class="actions">
    <button class="btn wa" data-a="wa">${ic('wa')} WhatsApp</button>
    <button class="btn red" data-a="mail">${ic('mail')} E-mail</button>
    <button class="btn ghost" data-a="ver">${ic('file')} Ver PDF</button>
    <button class="btn ghost" data-a="baixar">${ic('download')} Baixar PDF</button>
  </div>
  <button class="btn ghost" style="width:100%;margin-top:10px" data-a="share">${ic('share')} Compartilhar (outros apps)</button>
  <h3 class="sec">Inspeção</h3>
  ${resumoHTML(o)}
  <h3 class="sec">Dados</h3>
  <div class="card"><dl class="kv">
    <dt>Cliente</dt><dd>${esc(o.cliente.nome)}</dd>
    <dt>Telefone</dt><dd>${esc(o.cliente.telefone || '-')}</dd>
    <dt>E-mail</dt><dd>${esc(o.cliente.email || '-')}</dd>
    <dt>Ano / KM</dt><dd>${esc(o.veiculo.ano || '-')} · ${esc(o.veiculo.km || '-')} km</dd>
    <dt>Combustível</dt><dd>${esc(o.veiculo.combustivel)}</dd>
    <dt>Responsável</dt><dd>${esc(o.responsavel || '-')}</dd>
    ${o.previsao ? `<dt>Previsão</dt><dd>${fmtDate(o.previsao)}</dd>` : ''}
    <dt style="font-size:16px;color:var(--text)">Total</dt><dd style="font-size:18px;color:var(--red2)">${brl(t.total)}</dd>
  </dl></div>
  ${o.fotos.length ? `<h3 class="sec">Fotos (${o.fotos.length})</h3><div class="thumbs">${o.fotos.map(f => `<img src="${f.data}" alt="">`).join('')}</div>` : ''}
  <h3 class="sec">Ações</h3>
  <div class="actions">
    <a class="btn ghost" href="#/editar/${o.id}">${ic('edit', 18)} ${o.status === 'concluida' ? 'Editar' : 'Continuar'}</a>
    <button class="btn danger" data-a="del">${ic('trash', 18)} Excluir</button>
  </div>
  <p class="note">No celular, “WhatsApp” e “E-mail” abrem o menu de compartilhamento com o PDF já anexado. No computador, o PDF é baixado e a conversa/e-mail é aberta para você anexar o arquivo.</p>`;
  $$('[data-a]').forEach(b => b.onclick = () => acao(b.dataset.a, o));
}

/* ===================== PDF / envio ===================== */
const fileName = o => `OS-${numFmt(o.numero)}-${(o.veiculo.placa || '').replace(/[^\w]/g, '')}.pdf`;
function getPdf(o) {
  const c = state.pdf[o.id]; if (c && c.u === o.updatedAt) return c.blob;
  const blob = buildPDF(o, cfg).output('blob'); state.pdf[o.id] = { u: o.updatedAt, blob }; return blob;
}
function baixar(blob, name) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 30000);
}
function mensagem(o) {
  const t = totals(o), r = resultado(o);
  return `Olá, ${o.cliente.nome.split(' ')[0]}! Segue a Ordem de Serviço Nº ${numFmt(o.numero)} do seu ${o.veiculo.modelo} (placa ${o.veiculo.placa}).\n` +
    `Resultado da inspeção: ${r.txt}\nValor total: ${brl(t.total)}\n\n${cfg.nome}${cfg.telefone ? ' · ' + cfg.telefone : ''}`;
}
function foneWa(t) { let d = String(t || '').replace(/\D/g, ''); if (d.length === 10 || d.length === 11) d = '55' + d; return d; }

async function acao(a, o) {
  if (a === 'del') {
    if (!confirm(`Excluir a OS ${numFmt(o.numero)}? Esta ação não pode ser desfeita.`)) return;
    await DB.del(o.id); Cloud.queueDelete(o); toast('OS excluída'); location.hash = '#/ordens'; return;
  }
  let blob;
  try { blob = getPdf(o); } catch (e) { console.error(e); toast('Erro ao gerar o PDF: ' + e.message, 4000); return; }
  const name = fileName(o), txt = mensagem(o);
  if (a === 'baixar') { baixar(blob, name); toast('PDF baixado'); return; }
  if (a === 'ver') { const w = window.open(URL.createObjectURL(blob), '_blank'); if (!w) baixar(blob, name); return; }

  // celular: compartilha o arquivo PDF direto (WhatsApp, Gmail, etc.)
  const file = new File([blob], name, { type: 'application/pdf' });
  const podeArquivo = navigator.canShare && navigator.canShare({ files: [file] });
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (podeArquivo && (isMobile || a === 'share')) {
    try { await navigator.share({ files: [file], title: name, text: txt }); return; }
    catch (e) { if (e.name === 'AbortError') return; }
  }
  // computador / sem suporte: baixa o PDF e abre o canal com a mensagem
  baixar(blob, name);
  if (a === 'wa') {
    const f = foneWa(o.cliente.telefone);
    window.open(`https://wa.me/${f}?text=${encodeURIComponent(txt + '\n\n📎 PDF da OS em anexo.')}`, '_blank');
    toast('PDF baixado — anexe o arquivo na conversa do WhatsApp', 4500);
  } else if (a === 'mail') {
    location.href = `mailto:${encodeURIComponent(o.cliente.email || '')}?subject=${encodeURIComponent(`Ordem de Serviço Nº ${numFmt(o.numero)} - ${cfg.nome}`)}&body=${encodeURIComponent(txt + '\n\nO PDF da OS segue em anexo.')}`;
    toast('PDF baixado — anexe o arquivo ao e-mail', 4500);
  } else toast('PDF baixado');
}

/* ===================== CONFIGURAÇÕES ===================== */
function vConfig() {
  setTop('Configurações');
  const f = (l, k, ph = '') => `<label class="fld"><span>${l}</span><input data-c="${k}" value="${esc(cfg[k])}" placeholder="${esc(ph)}"></label>`;
  view.innerHTML = `
  <h3 class="sec">Dados da oficina (aparecem no PDF)</h3>
  <div class="card form">
    <div class="row"><div class="logo-prev" id="lp" style="${cfg.logo ? `background-image:url(${cfg.logo})` : ''}"></div>
      <div style="display:grid;gap:8px;flex:1"><label class="btn ghost sm">${ic('image', 16)} Enviar logo<input type="file" accept="image/*" hidden id="logo"></label>
      ${cfg.logo ? '<button class="btn danger sm" id="rmLogo">Remover logo</button>' : ''}</div></div>
    ${f('Nome da oficina', 'nome', 'EG Garage')}${f('Subtítulo', 'sub', 'Oficina Mecânica')}
    <div class="grid2">${f('CNPJ', 'cnpj', '00.000.000/0001-00')}${f('Telefone / WhatsApp', 'telefone', '(11) 99999-9999')}</div>
    ${f('E-mail', 'email', 'contato@oficina.com')}${f('Endereço', 'endereco', 'Rua, nº - Bairro - Cidade/UF')}
    ${f('Responsável padrão', 'responsavel')}
    <label class="fld"><span>Próximo número de OS</span><input type="number" min="1" data-c="prox" value="${cfg.prox}"></label>
  </div>
  ${Cloud.on ? `
  <h3 class="sec">Nuvem</h3>
  <div class="card form">
    <div class="row">${ic('cloud', 22)}<div style="flex:1;min-width:0"><b>Conectado</b><div class="note" style="margin:2px 0 0;overflow-wrap:anywhere">${esc(Cloud.user?.email || '')}</div></div></div>
    <div class="note" id="syncInfo" style="margin:0"></div>
    <button class="btn ghost" id="syncNow">${ic('cloud', 18)} Sincronizar agora</button>
    <button class="btn danger" id="sair">Sair desta conta</button>
    <p class="note" style="margin:0">Os dados ficam salvos na nuvem e também neste aparelho, então o sistema funciona mesmo sem internet e envia tudo quando a conexão voltar.</p>
  </div>` : `
  <h3 class="sec">Dados</h3>
  <div class="card form">
    <button class="btn ghost" id="seedB">Carregar ordens de exemplo</button>
    <button class="btn danger" id="clr">${ic('trash', 18)} Apagar todas as ordens</button>
    <p class="note" style="margin:0">Versão demo: os dados ficam salvos somente neste aparelho/navegador.</p>
  </div>`}`;
  if (Cloud.on) {
    const info = () => { const el = $('#syncInfo'); if (el) el.textContent = syncTxt(); };
    info(); Cloud.onStatus(info);
    $('#syncNow').onclick = async () => { const n = await Cloud.sync(); toast(Cloud.status.st === 'erro' ? 'Erro: ' + Cloud.status.msg : 'Sincronizado'); if (n) render(); };
    $('#sair').onclick = async () => {
      if (!confirm('Sair da conta? Os dados deste aparelho serão apagados (continuam salvos na nuvem).')) return;
      if ((await DB.all()).some(o => o._dirty) && !confirm('Existem OS ainda NÃO enviadas para a nuvem. Elas serão perdidas. Sair mesmo assim?')) return;
      await Cloud.logout(); await DB.clear(); location.hash = '#/inicio'; location.reload();
    };
  }
  $$('[data-c]').forEach(i => i.oninput = () => { cfg[i.dataset.c] = i.dataset.c === 'prox' ? Math.max(1, parseInt(i.value) || 1) : i.value; saveCfg(); $('#brand').innerHTML = brandHTML(); });
  $('#logo').onchange = async e => {
    const fl = e.target.files[0]; if (!fl) return;
    const r = await compress(fl, 360, 0.85); Object.assign(cfg, { logo: r.data, logoW: r.w, logoH: r.h }); saveCfg(); vConfig(); toast('Logo atualizada');
  };
  if ($('#rmLogo')) $('#rmLogo').onclick = () => { Object.assign(cfg, { logo: '', logoW: 0, logoH: 0 }); saveCfg(); vConfig(); };
  if (Cloud.on) return;
  $('#seedB').onclick = async () => { await seed(true); toast('Exemplos carregados'); };
  $('#clr').onclick = async () => { if (!confirm('Apagar TODAS as ordens de serviço deste aparelho? Não pode ser desfeito.')) return; await DB.clear(); cfg.prox = 1; saveCfg(); vConfig(); toast('Ordens apagadas'); };
}

/* ===================== dados de exemplo ===================== */
async function seed(force) {
  try { if (!force && localStorage.getItem('os_seeded')) return; localStorage.setItem('os_seeded', '1'); } catch (e) { if (!force) return; }
  if (!force && (await DB.all()).length) return;
  const allOk = () => { const c = {}; CHECKLIST.forEach(cat => cat.itens.forEach((_, i) => c[ckKey(cat, i)] = 'ok')); return c; };
  const mk = (dias, cli, vei, extra) => {
    const d = new Date(Date.now() - dias * 864e5).toISOString();
    return Object.assign(newOrder(), { numero: cfg.prox++, createdAt: d, updatedAt: d, cliente: cli, veiculo: vei }, extra);
  };
  const a = allOk(); a.motor_2 = 'at'; a.freios_1 = 'rp'; a.pneus_4 = 'at';
  const ords = [
    mk(0, { nome: 'João da Silva', telefone: '(11) 98888-1234', email: 'joao@email.com', doc: '' }, { modelo: 'Volkswagen Golf GTI', placa: 'CJD5E11', ano: '2017', km: '78.250', cor: 'Preto', combustivel: 'Meio' },
      { status: 'concluida', concluidaEm: new Date().toISOString(), checklist: a, reclamacao: 'Revisão completa e barulho ao frear.', obs: 'Revisar vazamento na tampa de válvula.',
        servicos: [{ tipo: 'servico', desc: 'Revisão completa', qtd: 1, valor: 350 }, { tipo: 'peca', desc: 'Pastilhas de freio traseiras', qtd: 1, valor: 289.9 }, { tipo: 'peca', desc: 'Óleo 5W40 sintético (L)', qtd: 5, valor: 54.9 }] }),
    mk(0, { nome: 'Carlos Mendes', telefone: '(11) 97777-5678', email: '', doc: '' }, { modelo: 'Honda Civic', placa: 'FGV3H21', ano: '2014', km: '112.400', cor: 'Prata', combustivel: '1/4' },
      { reclamacao: 'Barulho na suspensão dianteira.', servicos: [{ tipo: 'servico', desc: 'Diagnóstico de suspensão', qtd: 1, valor: 120 }] }),
    mk(2, { nome: 'Marcos Oliveira', telefone: '(11) 96666-9012', email: 'marcos@email.com', doc: '' }, { modelo: 'Peugeot 208', placa: 'HJK8D76', ano: '2019', km: '45.100', cor: 'Branco', combustivel: 'Cheio' },
      { status: 'concluida', concluidaEm: new Date(Date.now() - 2 * 864e5).toISOString(), checklist: allOk(), servicos: [{ tipo: 'servico', desc: 'Troca de óleo', qtd: 1, valor: 80 }, { tipo: 'peca', desc: 'Filtro de óleo', qtd: 1, valor: 45 }] }),
  ];
  for (const o of ords) await DB.put(o);
  saveCfg();
  if (location.hash.startsWith('#/inicio') || !location.hash) render();
}

/* ===================== nuvem: login + status ===================== */
function syncTxt() {
  const s = Cloud.status, at = s.at ? new Date(s.at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';
  return { sync: 'Sincronizando...', ok: `Sincronizado${at ? ' às ' + at : ''}`, offline: 'Sem internet — será enviado quando voltar', erro: 'Erro ao sincronizar: ' + s.msg, idle: 'Aguardando sincronização' }[s.st] || '';
}
function drawSyncDot() {
  const el = $('#syncDot'); if (!el) return;
  el.hidden = !Cloud.on || !Cloud.user;
  el.className = 'icon-btn sync-dot ' + Cloud.status.st; el.title = syncTxt();
}
function vLogin() {
  document.body.className = 'login';
  view.innerHTML = `
  <div class="login-box">
    <div class="logo" style="font-size:34px;text-align:center">${brandHTML().replace(/^<div class="logo">|<\/div>$/g, '')}</div>
    <p class="hint" style="text-align:center;margin:18px 0 22px">Entre com a conta da oficina para acessar as ordens de serviço.</p>
    <form id="lf" class="card form">
      <label class="fld"><span>E-mail</span><input type="email" id="le" autocomplete="username" required></label>
      <label class="fld"><span>Senha</span><input type="password" id="lp" autocomplete="current-password" required></label>
      <div id="lerr" class="note" style="color:#ff6b70;margin:0"></div>
      <button class="btn red" id="lb" style="width:100%">Entrar ${ic('chev', 18)}</button>
    </form>
  </div>`;
  $('#lf').onsubmit = async e => {
    e.preventDefault(); const b = $('#lb'); b.disabled = true; $('#lerr').textContent = '';
    try {
      await Cloud.login($('#le').value.trim(), $('#lp').value);
      document.body.className = ''; view.innerHTML = '<div class="empty">Carregando dados da nuvem...</div>';
      await DB.clear(); // descarta exemplos/dados locais antigos: a nuvem passa a ser a fonte
      try { localStorage.setItem('os_seeded', '1'); } catch (e2) { }
      await Cloud.sync(); drawSyncDot(); render();
    } catch (err) { $('#lerr').textContent = err.message; b.disabled = false; }
  };
}

/* ===================== start ===================== */
(async () => {
  if (!location.hash) history.replaceState(null, '', '#/inicio');
  $('.top-sp').outerHTML = `<button id="syncDot" class="icon-btn sync-dot" hidden aria-label="Sincronização">${ic('cloud', 22)}</button>`;
  if (!Cloud.on) { await seed(false); return render(); }
  Cloud.ctx = {
    DB, cfg: () => cfg,
    saveLocalCfg: d => { Object.assign(cfg, d); saveCfg(true); $('#brand').innerHTML = brandHTML(); },
    onDraftPaths: (id, paths) => { if (state.draft?.id === id) state.draft.fotos.forEach((f, i) => { if (!f.path && paths[i]) f.path = paths[i]; }); },
  };
  Cloud.onStatus(drawSyncDot);
  $('#syncDot').onclick = () => { toast(syncTxt()); Cloud.sync().then(afterSync); };
  let user = null;
  try { user = await Cloud.session(); } catch (e) { console.error(e); }
  if (!user) return vLogin();
  drawSyncDot(); render();
  Cloud.sync().then(afterSync);
  setInterval(() => Cloud.sync().then(afterSync), 60000);
  window.addEventListener('online', () => Cloud.sync().then(afterSync));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) Cloud.sync().then(afterSync); });
})();
