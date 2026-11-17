'use strict';
/* Gera o PDF da Ordem de Serviço (A4) com jsPDF, incluindo fotos e assinaturas.
   Depende de: window.jspdf, e das funções/constantes globais de app.js
   (CHECKLIST, ckKey, ckCounts, resultado, totals, brl, numFmt, fmtDate, fmtDateTime, num). */
function buildPDF(o, cfg) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const W = 210, H = 297, M = 12, CW = W - 2 * M, BOTTOM = H - 16;
  const RED = [214, 18, 26], DARK = [18, 18, 20], MUT = [110, 110, 118], TXT = [25, 25, 28];
  const GREEN = [22, 150, 70], YEL = [205, 120, 0], RPC = [210, 30, 36], NV = [150, 150, 156];
  let y = 0;

  const clean = t => String(t ?? '').replace(/[  ]/g, ' ').replace(/[^\x00-\xff]/g, '');
  const T = (t, x, yy, opt) => doc.text(clean(t), x, yy, opt);
  const font = (st = 'normal', sz = 9, col = TXT) => { doc.setFont('helvetica', st); doc.setFontSize(sz); doc.setTextColor(...col); };
  const fit = (t, w) => { const s = clean(t) || '-'; const l = doc.splitTextToSize(s, w); return l.length > 1 ? l[0].replace(/\s+\S*$/, '') + '...' : l[0]; };
  const stColor = st => st === 'ok' ? GREEN : st === 'at' ? YEL : st === 'rp' ? RPC : NV;
  const tint = c => c.map(v => Math.round(v + (255 - v) * 0.9));

  function header() {
    doc.setFillColor(...DARK); doc.rect(0, 0, W, 30, 'F');
    doc.setFillColor(...RED); doc.rect(0, 30, W, 1.2, 'F');
    let x = M;
    if (cfg.logo && cfg.logoW) {
      const r = Math.min(24 / cfg.logoW, 22 / cfg.logoH), lw = cfg.logoW * r, lh = cfg.logoH * r;
      try { doc.addImage(cfg.logo, 'JPEG', M, 4 + (22 - lh) / 2, lw, lh, 'logo'); x = M + lw + 4; } catch (e) { }
    }
    font('bolditalic', 19, [255, 255, 255]); T(cfg.nome || 'Oficina', x, 12.5);
    const nw = doc.getTextWidth(clean(cfg.nome || 'Oficina'));
    font('bold', 7, [230, 60, 66]); T((cfg.sub || '').toUpperCase(), x + 0.5, 17.5);
    font('normal', 7.2, [185, 185, 192]);
    const l1 = [cfg.cnpj && 'CNPJ ' + cfg.cnpj, cfg.telefone, cfg.email].filter(Boolean).join('   |   ');
    if (l1) T(fit(l1, 120), x + 0.5, 22);
    if (cfg.endereco) T(fit(cfg.endereco, 120), x + 0.5, 26);
    font('normal', 7.5, [185, 185, 192]); T('ORDEM DE SERVIÇO', W - M, 10, { align: 'right' });
    font('bold', 17, [255, 255, 255]); T('Nº ' + numFmt(o.numero), W - M, 18, { align: 'right' });
    font('normal', 7.5, [185, 185, 192]); T('Entrada: ' + fmtDateTime(o.createdAt), W - M, 24, { align: 'right' });
    y = 38;
    return nw;
  }
  function ensure(h) { if (y + h > BOTTOM) { doc.addPage(); header(); } }
  function section(t, need = 14) {
    ensure(need); doc.setFillColor(...RED); doc.rect(M, y, 1.6, 5, 'F');
    font('bold', 10, TXT); T(t.toUpperCase(), M + 4, y + 4); y += 8;
  }
  function paragraph(title, text) {
    if (!String(text || '').trim()) return;
    section(title, 16);
    font('normal', 9, [45, 45, 50]);
    doc.splitTextToSize(clean(text), CW).forEach(l => { ensure(5); T(l, M, y + 3); y += 4.4; });
    y += 4;
  }
  function kvBox(x, w, title, rows, yy) {
    const lh = 5.3, h = 9.5 + rows.length * lh;
    doc.setFillColor(246, 246, 248); doc.setDrawColor(226, 226, 231); doc.setLineWidth(0.2);
    doc.roundedRect(x, yy, w, h, 2, 2, 'FD');
    font('bold', 8, RED); T(title.toUpperCase(), x + 3.5, yy + 5.5);
    rows.forEach(([k, v], i) => {
      const ry = yy + 11.2 + i * lh;
      font('normal', 7.5, MUT); T(k, x + 3.5, ry);
      font('bold', 8.5, TXT); T(fit(v, w - 29), x + 25, ry);
    });
    return h;
  }

  /* ---------- cabeçalho + dados ---------- */
  header();
  const half = (CW - 4) / 2;
  const h1 = kvBox(M, half, 'Cliente', [['Nome', o.cliente.nome], ['Telefone', o.cliente.telefone], ['E-mail', o.cliente.email], ['CPF/CNPJ', o.cliente.doc], ['Responsável', o.responsavel]], y);
  const h2 = kvBox(M + half + 4, half, 'Veículo', [['Modelo', o.veiculo.modelo], ['Placa', (o.veiculo.placa || '').toUpperCase()],
    ['Ano / Cor', [o.veiculo.ano, o.veiculo.cor].filter(Boolean).join(' / ')], ['Quilometragem', o.veiculo.km ? o.veiculo.km + ' km' : ''], ['Combustível', o.veiculo.combustivel]], y);
  y += Math.max(h1, h2) + 3;

  // faixa de status
  font('normal', 8, MUT);
  const strip = [`Status: ${o.status === 'concluida' ? 'Concluída' : 'Em andamento'}`, o.concluidaEm && `Conclusão: ${fmtDateTime(o.concluidaEm)}`, o.previsao && `Previsão de entrega: ${fmtDate(o.previsao)}`].filter(Boolean).join('     |     ');
  T(strip, M, y + 3); y += 8;

  paragraph('Reclamação / solicitação do cliente', o.reclamacao);

  /* ---------- resultado ---------- */
  const c = ckCounts(o);
  if (c.feitos) {
    section('Resultado da inspeção', 32);
    const r = resultado(o), col = r.cls === 'ok' ? GREEN : r.cls === 'at' ? YEL : RPC;
    const bw = CW * 0.48;
    doc.setFillColor(...tint(col)); doc.setDrawColor(...col); doc.setLineWidth(0.4);
    doc.roundedRect(M, y, bw, 19, 2, 2, 'FD');
    font('bold', r.txt.length > 12 ? 11 : 15, col); T(r.txt, M + 5, y + 8.5);
    font('normal', 7.8, [80, 80, 86]); T(`${r.sub}  -  ${c.feitos} itens verificados`, M + 5, y + 14.5);
    const gx = M + bw + 4, gw = (CW - bw - 4 - 6) / 3;
    [[c.ok, 'Em bom estado', GREEN], [c.at, 'Atenção', YEL], [c.rp, 'Reprovado', RPC]].forEach(([n, l, cc], i) => {
      const x = gx + i * (gw + 3);
      doc.setFillColor(...tint(cc)); doc.setDrawColor(...cc); doc.setLineWidth(0.2); doc.roundedRect(x, y, gw, 19, 2, 2, 'FD');
      font('bold', 16, cc); T(String(n), x + gw / 2, y + 9.5, { align: 'center' });
      font('normal', 7.3, [80, 80, 86]); T(l, x + gw / 2, y + 15, { align: 'center' });
    });
    y += 25;

    /* ---------- checklist ---------- */
    section('Checklist técnico', 20);
    const colW = (CW - 6) / 2, rh = 5.4;
    CHECKLIST.forEach(cat => {
      const items = cat.itens.map((it, i) => [it, o.checklist[ckKey(cat, i)]]);
      if (!items.some(x => x[1])) return;
      const rows = Math.ceil(items.length / 2);
      ensure(8 + rows * rh);
      doc.setFillColor(238, 238, 242); doc.rect(M, y, CW, 6, 'F');
      font('bold', 8.5, TXT); T(cat.nome, M + 2.5, y + 4.2);
      const n = items.filter(x => x[1]).length; font('normal', 7.5, MUT); T(`${n}/${items.length}`, M + CW - 2.5, y + 4.2, { align: 'right' });
      y += 7.5;
      items.forEach(([it, st], i) => {
        const x = M + (i % 2) * (colW + 6), yy = y + Math.floor(i / 2) * rh + 3.4;
        const cc = stColor(st);
        doc.setFillColor(...cc); doc.circle(x + 1.6, yy - 1.1, 1.1, 'F');
        font('normal', 8.2, [45, 45, 50]); T(fit(it, colW - 30), x + 4.5, yy);
        font('bold', 7.4, cc); T(st ? ST[st].toUpperCase() : 'NÃO VERIFICADO', x + colW, yy, { align: 'right' });
        doc.setDrawColor(234, 234, 238); doc.setLineWidth(0.15); doc.line(x, yy + 1.7, x + colW, yy + 1.7);
      });
      y += rows * rh + 3;
    });
    y += 2;
  }

  paragraph('Avarias existentes na entrada', o.avarias);

  /* ---------- serviços ---------- */
  if (o.servicos.length) {
    section('Serviços e peças', 24);
    const cols = [{ t: 'Tipo', w: 20 }, { t: 'Descrição', w: CW - 20 - 14 - 30 - 30 }, { t: 'Qtd', w: 14, r: 1 }, { t: 'Valor unit.', w: 30, r: 1 }, { t: 'Total', w: 30, r: 1 }];
    const row = (vals, head) => {
      ensure(7);
      if (head) { doc.setFillColor(...DARK); doc.rect(M, y, CW, 6.8, 'F'); font('bold', 7.8, [255, 255, 255]); }
      else font('normal', 8.5, TXT);
      let x = M;
      vals.forEach((v, i) => { const cl = cols[i]; T(head ? v : fit(v, cl.w - 4), cl.r ? x + cl.w - 2 : x + 2, y + 4.6, cl.r ? { align: 'right' } : undefined); x += cl.w; });
      if (!head) { doc.setDrawColor(228, 228, 233); doc.setLineWidth(0.15); doc.line(M, y + 6.8, M + CW, y + 6.8); }
      y += 6.8;
    };
    row(cols.map(c => c.t), true);
    o.servicos.forEach(s => row([s.tipo === 'peca' ? 'Peça' : 'Serviço', s.desc, String(num(s.qtd)).replace('.', ','), brl(s.valor), brl(num(s.qtd) * num(s.valor))]));
    const t = totals(o); y += 2;
    [['Serviços', brl(t.serv)], ['Peças', brl(t.pecas)], t.desc ? ['Desconto', '- ' + brl(t.desc)] : null].filter(Boolean).forEach(([k, v]) => {
      ensure(5); font('normal', 8.5, MUT); T(k, M + CW - 36, y + 3.6, { align: 'right' }); font('bold', 8.5, TXT); T(v, M + CW - 2, y + 3.6, { align: 'right' }); y += 5;
    });
    ensure(13); doc.setFillColor(...RED); doc.roundedRect(M + CW - 74, y + 1, 74, 9.5, 1.5, 1.5, 'F');
    font('bold', 11, [255, 255, 255]); T('TOTAL', M + CW - 71, y + 7.4); T(brl(t.total), M + CW - 3, y + 7.4, { align: 'right' });
    y += 16;
  }

  paragraph('Observações técnicas', o.obs);

  /* ---------- fotos ---------- */
  if (o.fotos.length) {
    const cw = (CW - 6) / 2, ih = 64;
    section(`Registro fotográfico (${o.fotos.length})`, ih + 20);
    for (let i = 0; i < o.fotos.length; i += 2) {
      ensure(ih + 9);
      [0, 1].forEach(j => {
        const f = o.fotos[i + j]; if (!f) return;
        const x = M + j * (cw + 6);
        doc.setFillColor(238, 238, 242); doc.rect(x, y, cw, ih, 'F');
        const r = Math.min(cw / f.w, ih / f.h), w = f.w * r, h = f.h * r;
        try { doc.addImage(f.data, 'JPEG', x + (cw - w) / 2, y + (ih - h) / 2, w, h, 'foto' + (i + j), 'FAST'); } catch (e) { console.warn(e); }
        font('bold', 7.6, TXT); T(`Foto ${i + j + 1}`, x, y + ih + 4);
        if (f.legenda) { const lw = doc.getTextWidth(`Foto ${i + j + 1}`) + 2; font('normal', 7.6, MUT); T(fit(f.legenda, cw - lw), x + lw, y + ih + 4); }
      });
      y += ih + 8;
    }
    y += 2;
  }

  /* ---------- termo + assinaturas ---------- */
  ensure(62);
  section('Termo e assinaturas', 0);
  font('normal', 7.6, [90, 90, 96]);
  doc.splitTextToSize(clean('Declaro que o veículo descrito foi entregue nas condições registradas neste documento (inclusive fotos) e que estou ciente dos serviços, peças e valores informados, autorizando sua execução.'), CW)
    .forEach(l => { T(l, M, y + 2); y += 3.7; });
  y += 5;
  const sw = (CW - 14) / 2, sh = 24;
  [[o.assCliente, o.cliente.nome || 'Cliente', 'Assinatura do cliente'], [o.assResp, o.responsavel || 'Responsável', 'Responsável técnico']].forEach(([s, n, l], j) => {
    const x = M + j * (sw + 14);
    if (s?.data) { const r = Math.min(sw / s.w, sh / s.h), w = s.w * r, h = s.h * r; try { doc.addImage(s.data, 'PNG', x + (sw - w) / 2, y + (sh - h), w, h, 'sig' + j); } catch (e) { } }
    doc.setDrawColor(60, 60, 64); doc.setLineWidth(0.3); doc.line(x, y + sh + 1, x + sw, y + sh + 1);
    font('bold', 8.5, TXT); T(fit(n, sw), x + sw / 2, y + sh + 5.5, { align: 'center' });
    font('normal', 7.2, MUT); T(l, x + sw / 2, y + sh + 9, { align: 'center' });
  });

  /* ---------- rodapé ---------- */
  const n = doc.getNumberOfPages(), ger = fmtDateTime(new Date().toISOString());
  for (let p = 1; p <= n; p++) {
    doc.setPage(p);
    doc.setDrawColor(225, 225, 230); doc.setLineWidth(0.2); doc.line(M, H - 11, W - M, H - 11);
    font('normal', 7, [140, 140, 146]);
    T(`${cfg.nome} - OS Nº ${numFmt(o.numero)} - Documento gerado em ${ger}`, M, H - 7);
    T(`Página ${p} de ${n}`, W - M, H - 7, { align: 'right' });
  }
  doc.setProperties({ title: `Ordem de Serviço ${numFmt(o.numero)}`, subject: `${o.veiculo.modelo} ${o.veiculo.placa}`, author: cfg.nome });
  return doc;
}
