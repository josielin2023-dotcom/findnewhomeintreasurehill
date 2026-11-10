/* 巖來如此 — 主程式 */

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const state = {
  phase: 'title',
  client: null, spot: null, facilities: [],
  visited: new Set(),
  photo: { x: 240, y: 250, scale: 1, light: 'noon', captured: false },
  ad: { name: '', slogan: '', reason: '', notice: '' },
  deck: [], drawnClient: null, redrawn: false,
  completed: 0, muted: false, adNo: ''
};

/* ---------- 工具 ---------- */

function shuffle(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function pick(arr, not) { const pool = arr.filter(x => x !== not); return pool[Math.floor(Math.random() * pool.length)] || arr[0]; }

let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ---------- 音效 ---------- */

const SFX = (() => {
  let ctx = null;
  function ensure() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, dur, type = 'sine', vol = 0.16, when = 0) {
    if (state.muted) return;
    try {
      const c = ensure(), o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, c.currentTime + when);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + when + dur);
      o.connect(g).connect(c.destination);
      o.start(c.currentTime + when); o.stop(c.currentTime + when + dur + 0.02);
    } catch (e) { /* 靜音失敗不影響遊戲 */ }
  }
  return {
    click: () => tone(520, 0.06, 'triangle', 0.1),
    flip: () => { tone(300, 0.1, 'sine', 0.1); tone(520, 0.1, 'sine', 0.09, 0.06); },
    select: () => { tone(660, 0.07, 'triangle', 0.12); tone(880, 0.07, 'triangle', 0.1, 0.05); },
    shutter: () => { tone(1300, 0.03, 'square', 0.09); tone(320, 0.08, 'sine', 0.14, 0.04); },
    stamp: () => { tone(130, 0.16, 'sine', 0.28); tone(85, 0.1, 'sine', 0.2, 0.02); },
    success: () => [523, 659, 784].forEach((f, i) => tone(f, 0.13, 'triangle', 0.13, i * 0.09)),
    sad: () => { tone(320, 0.2, 'sawtooth', 0.07); tone(230, 0.26, 'sawtooth', 0.07, 0.13); }
  };
})();

/* ---------- SVG 產生 ---------- */

function sceneSvg(spotId, cls = 'scene') {
  return `<svg class="${cls}" viewBox="0 0 480 360" role="img" aria-label="寶藏巖現地場景">${SCENES[spotId]}</svg>`;
}
function photoSceneSvg(bake = false) {
  const p = state.photo;
  const t = `translate(${p.x} ${p.y}) scale(${p.scale})`;
  const inner = SCENES[state.spot.id] + `<g id="puppetUse" transform="${t}">${PUPPETS[state.client.id]}</g>`;
  const head = bake ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360">` : `<svg id="photoScene" viewBox="0 0 480 360">`;
  return head + inner + `</svg>`;
}
function puppetSvg(clientId, cls = 'puppet') {
  return `<svg class="${cls}" viewBox="-46 -58 92 98" role="img" aria-label="紙偶">${PUPPETS[clientId]}</svg>`;
}
function lightOverlayHtml(cls) {
  return `<div class="light-overlay lo-${cls}" style="--fx:${(state.photo.x / 480 * 100).toFixed(1)}%;--fy:${(state.photo.y / 360 * 100).toFixed(1)}%"></div>`;
}
function starSvg(on) {
  return `<svg class="st" viewBox="0 0 24 24"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8Z"
    fill="${on ? '#e3b23c' : 'none'}" stroke="${on ? '#a8791f' : '#c9c2ae'}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
}
const sealSvg = (size = 84) => `<svg viewBox="0 0 100 100" style="width:${size}px;height:${size}px" aria-hidden="true">
  <circle cx="50" cy="50" r="47" fill="#c0392b"/>
  <circle cx="50" cy="50" r="40" fill="none" stroke="#f6ecd8" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="50" y="63" text-anchor="middle" font-size="40" font-family="'LXGW WenKai TC','Noto Sans TC',serif" fill="#f6ecd8" font-weight="700">巖</text>
</svg>`;

/* ---------- 評分 ---------- */

function matchInfo() {
  const union = new Set([...state.spot.baseTags, ...state.facilities.flatMap(f => f.tags)]);
  const covered = state.client.needs.filter(n => union.has(n));
  const missed = state.client.needs.filter(n => !union.has(n));
  const violated = state.client.taboos.filter(t => union.has(t));
  return { union, covered, missed, violated };
}
function computeScore() {
  const { covered, violated } = matchInfo();
  const match = covered.length / state.client.needs.length * 80;
  const penalty = violated.length * 20;
  const bonus = state.facilities.length * 5;
  return Math.max(0, Math.min(100, Math.round(match + bonus - penalty)));
}
function starsOf(s) { return s >= 90 ? 5 : s >= 75 ? 4 : s >= 55 ? 3 : s >= 35 ? 2 : 1; }

function autoReason() {
  const { covered } = matchInfo();
  const nd = covered.map(n => NEED_DESC[n]).join('、');
  let t = `本宅位於寶藏巖【${state.spot.name}】，${nd}完全命中${state.client.name}的居住需求。`;
  state.facilities.forEach(f => { t += `\n・${f.facility}（原為${f.obj}）——${f.note}`; });
  return t;
}
function autoNotice() {
  const { violated } = matchInfo();
  let t = '';
  if (violated.length) t += violated.map(v => TABOO_WARN[v]).join('\n');
  else t += '本宅經查無重大禁忌，屬安全可入住物件。';
  t += '\n' + pick(RULES);
  return t;
}

/* ---------- HUD ---------- */

const PHASES = [
  ['draw', '接受委託'], ['explore', '聚落尋屋'], ['translate', '住宅示圖'],
  ['ad', '招租廣告'], ['reveal', '房仲發表']
];

function hudHtml() {
  const pi = PHASES.findIndex(p => p[0] === state.phase);
  let steps = '';
  if (state.phase !== 'title') {
    steps = '<nav class="steps">' + PHASES.map((p, i) => {
      const dot = `<span class="dot">${i < pi ? '✓' : i + 1}</span><span class="lbl">${p[1]}</span>`;
      const cls = i === pi ? 'on' : i < pi ? 'done' : '';
      return `<span class="step ${cls}">${dot}</span>` + (i < PHASES.length - 1 ? '<span class="step-arrow">▸</span>' : '');
    }).join('') + '</nav>';
  }
  const badge = state.completed > 0 ? `<span class="chip" style="border-color:var(--ok);color:var(--ok)">已成交 ${state.completed} 件</span>` : '';
  const iconOn = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const iconOff = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6"/></svg>';
  const mute = `<button id="muteBtn" class="icon-btn" aria-label="切換音效">${state.muted ? iconOff : iconOn}</button>`;
  return `<header class="hud"><div class="hud-inner">
    <div class="hud-brand">
      <svg class="seal-mini" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="#b4593a"/><circle cx="20" cy="20" r="15.5" fill="none" stroke="#f4edda" stroke-width="1.5" stroke-dasharray="3 2"/><text x="20" y="27" text-anchor="middle" font-size="17" font-family="'LXGW WenKai TC',serif" fill="#f4edda" font-weight="700">巖</text></svg>
      <div class="hud-title">巖來如此<small>寶藏巖非人類居住調查局</small></div>
    </div>
    ${steps}
    <div class="hud-right">${badge}${mute}</div>
  </div></header>`;
}

function clientBarHtml() {
  const c = state.client;
  const m = state.spot ? matchInfo() : null;
  const needChips = c.needs.map(n => `<span class="chip chip-need ${m && m.covered.includes(n) ? 'on' : ''}">${n}</span>`).join('');
  const tabooChips = c.taboos.map(t => `<span class="chip chip-taboo ${m && m.violated.includes(t) ? 'on' : ''}">✕ ${t}</span>`).join('');
  return `<div class="card match-panel">
    ${puppetSvg(c.id)}
    <div style="flex:1;min-width:220px">
      <div class="match-title">${esc(c.name)}｜${esc(c.species)}·${esc(c.title)}</div>
      <div class="cp-quote" style="margin-top:4px">${esc(c.intro)}</div>
      <div class="cp-needs">
        <span class="cp-row"><span class="lbl">需求</span>${needChips}</span>
        <span class="cp-row"><span class="lbl">禁忌</span>${tabooChips}</span>
      </div>
    </div>
  </div>`;
}

/* ---------- 各階段畫面 ---------- */

function titleHtml() {
  return `<section class="title-screen">
    <div class="card" style="padding:10px;max-width:600px;margin:0 auto">
      <svg viewBox="0 45 480 245" role="img" aria-label="寶藏巖聚落插畫" style="border-radius:8px">${SCENES.roof}</svg>
    </div>
    <h1 class="title-name" style="margin-top:16px">巖來如此</h1>
    <div class="title-sub">寶藏巖非人類居住調查局</div>
    <p class="title-q">「如果你不是人類，你會想住在寶藏巖的哪個角落？」</p>
    <div class="title-desc">我們每天都習慣用人類的角度理解空間：看到樓梯，想到上下樓；看到水管，想到排水；看到牆壁，想到區隔。<br><br>
    但在這座依山而建、高低錯落的聚落裡，還住著一群不會使用人類房屋仲介的租屋需求者。本局現受理非人類住民之租屋委託——您將以<b>特約房仲</b>的身分，替委託租客走進聚落、勘查環境、把水管與陰影轉譯成住宅設施，拍一張入住照，寫一張有說服力的招租廣告。</div>
    <div class="title-actions">
      <button class="btn btn-primary" id="startBtn">開始執行任務</button>
    </div>
    <p class="title-foot">體驗時間約 20 分鐘 ｜ 靈感來自寶藏巖聚落 · 巖來如此居住調查局</p>
  </section>`;
}

function drawHtml() {
  const deck = state.deck.map((c, i) => {
    const flipped = state.drawnClient && state.drawnClient.id === c.id;
    return `<div class="tcard ${flipped ? 'flipped' : ''}" data-i="${i}">
      <div class="tcard-inner">
        <div class="tcard-face tcard-back"><span class="mark">委託函</span><small>居住調查局 敬託</small></div>
        <div class="tcard-face tcard-front">
          ${puppetSvg(c.id)}
          <span class="cname">${esc(c.species)}租客</span>
          <span class="ctitle">點我翻開委託</span>
        </div>
      </div>
    </div>`;
  }).join('');
  return `<section>
    <div class="section-title"><h2>受理委託</h2><span class="en">STEP 1 · CLIENT INTAKE</span></div>
    <p class="hint" style="margin-bottom:14px">調查局今日收到四筆非人類租屋委託。點選一張委託函，看看這次的租客是誰。</p>
    <div class="deck">${deck}</div>
    <div id="clientPanel">${clientPanelHtml()}</div>
  </section>`;
}

function clientPanelHtml() {
  const c = state.drawnClient;
  if (!c) return '';
  return `<div class="card client-panel">
    <div class="cp-head">
      ${puppetSvg(c.id)}
      <div style="flex:1;min-width:220px">
        <div class="cp-name">${esc(c.name)}</div>
        <div class="cp-species">${esc(c.species)} ｜ ${esc(c.title)} ｜ ${esc(c.budget)}</div>
        <div class="cp-quote">${esc(c.intro)}</div>
        <div class="cp-needs">
          <span class="cp-row"><span class="lbl">需求</span>${c.needs.map(n => `<span class="chip chip-need">${n}</span>`).join('')}</span>
          <span class="cp-row"><span class="lbl">禁忌</span>${c.taboos.map(t => `<span class="chip chip-taboo">✕ ${t}</span>`).join('')}</span>
        </div>
      </div>
    </div>
    <div class="panel-actions">
      <button class="btn btn-primary" id="acceptBtn">接受委託，前往聚落</button>
      ${state.redrawn ? '' : '<button class="btn btn-ghost" id="redrawBtn">重抽一次（僅限一次）</button>'}
    </div>
  </div>`;
}

function mapSvgHtml() {
  const pts = SPOTS.map(s => s.map);
  const trail = 'M' + pts.map(p => `${p.x} ${p.y}`).join(' L');
  const markers = SPOTS.map(s => `
    <g class="marker ${state.visited.has(s.id) ? 'visited' : ''}" data-spot="${s.id}" role="button" tabindex="0" aria-label="${esc(s.name)}">
      <circle class="m-dot" cx="${s.map.x}" cy="${s.map.y}" r="15" fill="#faf5e8" stroke="#33302a" stroke-width="2"/>
      <text class="m-num" x="${s.map.x}" y="${s.map.y + 4}" text-anchor="middle" font-size="13" font-weight="700" fill="#33302a" font-family="'Noto Sans TC',sans-serif">${s.no}</text>
      <text x="${s.map.x}" y="${s.map.y + 33}" text-anchor="middle" font-size="11.5" fill="#3d3a32" stroke="#efe8d3" stroke-width="4" paint-order="stroke" font-family="'Noto Sans TC',sans-serif" font-weight="700">${s.name}</text>
    </g>`).join('');
  return `<svg viewBox="0 0 480 300" role="img" aria-label="寶藏巖聚落地圖">
    <rect width="480" height="300" fill="#e7e0ca" rx="8"/>
    <circle cx="70" cy="52" r="18" fill="#e3b23c" opacity="0.85"/>
    <path d="M0 240 L90 170 210 235 340 175 480 225 480 300 0 300 Z" fill="#93a878"/>
    <path d="M0 270 C140 240 300 285 480 250 L480 300 0 300 Z" fill="#6e8a5e"/>
    <path d="M0 200 L70 150 150 205 260 160 340 195 430 155 480 180" stroke="#c9bfa5" stroke-width="0" fill="none"/>
    ${houseSvg(300, 60, 46, 30, '#b4593a', '#5d4a3c', 16)}
    ${houseSvg(352, 68, 40, 26, '#c8b29a', '#8a5f4b', 15)}
    ${houseSvg(252, 66, 38, 26, '#c8b29a', '#8a5f4b', 14)}
    <path d="${trail}" stroke="#5c564a" stroke-width="2" stroke-dasharray="5 5" fill="none" opacity="0.65"/>
    ${markers}
    <text x="416" y="66" text-anchor="middle" font-size="11" fill="#5c564a" font-family="'Noto Sans TC',sans-serif" font-weight="700">往 新店溪 ↘</text>
  </svg>`;
}

function exploreMapHtml() {
  const cards = SPOTS.map(s => `
    <div class="card spot-card" data-spot="${s.id}" role="button" tabindex="0">
      <div class="sc-top"><span class="sc-num">${s.no}</span><h3>${esc(s.name)}</h3></div>
      <div class="sc-sub">${esc(s.sub)}</div>
      <div class="sc-tags">${s.baseTags.map(t => `<span class="tag ${NEED_DESC[t] ? 'tag-pos' : 'tag-neg'}">${t}</span>`).join('')}</div>
      ${state.visited.has(s.id) ? '<div class="sc-visited">✓ 已勘查</div>' : ''}
    </div>`).join('');
  return `<section>
    ${clientBarHtml()}
    <div class="section-title"><h2>聚落尋屋</h2><span class="en">STEP 2 · FIELD SURVEY</span></div>
    <p class="hint" style="margin-bottom:14px">依照租客需求走進聚落，勘查每個角落（至少 <b>3 處</b>）再決定刊登地點。綠色標籤是環境優點，紅色標籤是潛在禁忌。</p>
    <div class="card map-card">${mapSvgHtml()}</div>
    <div class="section-title"><h2>房源列表</h2><span class="en">LISTINGS</span></div>
    <div class="spot-grid">${cards}</div>
  </section>`;
}

function exploreDetailHtml() {
  const s = state.spot;
  const els = s.elements.map(e => `
    <div class="card el-card">
      <div class="el-main">
        <div class="el-obj">${esc(e.obj)}</div>
        <div class="el-note">${esc(e.note)}</div>
      </div>
      <div class="el-tags">${e.tags.map(t => `<span class="tag ${NEED_DESC[t] ? 'tag-pos' : 'tag-neg'}">${t}</span>`).join('')}</div>
    </div>`).join('');
  const canPick = state.visited.size >= 3;
  return `<section>
    <div class="detail-top">
      <h2>${s.no}｜${esc(s.name)}</h2>
      <button class="btn btn-ghost btn-sm back" id="backMap">← 返回地圖</button>
    </div>
    <div class="detail-layout">
      <div class="card detail-scene">${sceneSvg(s.id)}</div>
      <div>
        <p class="detail-desc">${esc(s.desc)}</p>
        <div class="section-title"><h2 style="font-size:1.2rem">現地元素</h2><span class="en">FOUND ON SITE</span></div>
        <div class="el-list">${els}</div>
      </div>
    </div>
    <div class="detail-actions">
      <button class="btn btn-primary" id="pickSpot" ${canPick ? '' : 'disabled'}>決定在此刊登</button>
      <span class="hint">${canPick ? '地點確定後，就開始把現地元素轉譯成住宅設施。' : `還不能決定——請先勘查至少 3 處（目前 ${state.visited.size} 處）。`}</span>
    </div>
  </section>`;
}

function translateFacHtml() {
  const s = state.spot;
  const cards = s.elements.map((e, i) => {
    const sel = state.facilities.includes(e);
    return `<div class="card fac-card ${sel ? 'sel' : ''}" data-i="${i}" role="button" tabindex="0">
      <span class="fac-check">✓</span>
      <div class="f-trans">「${esc(e.facility)}」</div>
      <div class="f-obj">原為：${esc(e.obj)}</div>
      <div class="f-note">${esc(e.note)}</div>
      <div class="f-tags">${e.tags.map(t => `<span class="tag ${NEED_DESC[t] ? 'tag-pos' : 'tag-neg'}">${t}</span>`).join('')}</div>
    </div>`;
  }).join('');
  return `<section>
    ${clientBarHtml()}
    <div class="section-title"><h2>住宅示圖 · 設施轉譯</h2><span class="en">STEP 3 · TRANSLATE</span></div>
    <p class="hint" style="margin-bottom:14px">把【${esc(s.name)}】的現地元素轉譯成住宅設施，最多選 <b>3 項</b>。注意：有些設施雖然厲害，卻可能踩到${esc(state.client.name)}的禁忌。</p>
    <div class="fac-grid">${cards}</div>
    <div class="panel-actions">
      <button class="btn btn-primary" id="toPhoto" ${state.facilities.length ? '' : 'disabled'}>前往借位攝影 →</button>
      <span class="hint">${state.facilities.length ? `已選 ${state.facilities.length} 項設施` : '請至少選 1 項設施'}</span>
    </div>
  </section>`;
}

function translatePhotoHtml() {
  const p = state.photo;
  const lights = LIGHTS.map(l => `<button data-light="${l.id}" class="${p.light === l.id ? 'on' : ''}">${l.label}</button>`).join('');
  return `<section>
    ${clientBarHtml()}
    <div class="section-title"><h2>住宅示圖 · 借位攝影</h2><span class="en">STEP 3 · PHOTO</span></div>
    <p class="hint" style="margin-bottom:14px">拿著${esc(state.client.name)}的紙偶走進場景：<b>拖曳紙偶</b>調整位置、縮放大小，再選一種光線，為住宅拍下入住形象照。</p>
    <div class="card photo-stage">
      <div class="photo-frame" id="photoFrame">
        ${photoSceneSvg()}
        ${lightOverlayHtml(p.light)}
        <div class="flash" id="flash"></div>
      </div>
      <div class="photo-controls">
        <div class="seg" id="lightSeg">${lights}</div>
        <div class="size-ctl">紙偶大小 <input type="range" id="pupSize" min="0.6" max="1.8" step="0.05" value="${p.scale}"></div>
        <button class="shutter" id="shutterBtn" aria-label="拍照">喀嚓</button>
      </div>
    </div>
    <div id="photoResult">${p.captured ? capturedHtml() : ''}</div>
  </section>`;
}

function capturedHtml() {
  return `<div style="text-align:center;margin-top:18px">
    <figure class="polaroid">
      <div class="ph-wrap">${photoSceneSvg(true)}${lightOverlayHtml(state.photo.light)}</div>
      <figcaption>入住形象照｜寶藏巖 · ${esc(state.spot.name)}</figcaption>
    </figure>
    <div class="panel-actions" style="justify-content:center">
      <button class="btn btn-ghost" id="retakeBtn">重拍一張</button>
      <button class="btn btn-primary" id="usePhotoBtn">就用這張，去寫廣告 →</button>
    </div>
  </div>`;
}

function adHtml() {
  const a = state.ad;
  return `<section>
    ${clientBarHtml()}
    <div class="section-title"><h2>招租廣告</h2><span class="en">STEP 4 · ADVERTISEMENT</span></div>
    <div class="ad-layout">
      <div class="card ad-form">
        <div class="field">
          <label>房屋名稱<span class="flabel">為住宅取一個名字</span></label>
          <input type="text" id="adName" maxlength="12" value="${esc(a.name)}" placeholder="例如：管中窺豹公寓">
          <div class="inline-btns"><button class="btn btn-ghost btn-sm" id="nameBtn">✦ 靈感</button></div>
        </div>
        <div class="field">
          <label>招租標語<span class="flabel">一句話打動租客</span></label>
          <input type="text" id="adSlogan" maxlength="18" value="${esc(a.slogan)}" placeholder="例如：找不到的，才是家。">
          <div class="inline-btns"><button class="btn btn-ghost btn-sm" id="sloganBtn">✦ 靈感</button></div>
        </div>
        <div class="field">
          <label>推薦理由<span class="flabel">環境如何滿足租客需求</span></label>
          <textarea id="adReason" rows="5">${esc(a.reason)}</textarea>
        </div>
        <div class="field">
          <label>房仲提醒<span class="flabel">空間限制與共生守則</span></label>
          <textarea id="adNotice" rows="4">${esc(a.notice)}</textarea>
        </div>
        <div class="panel-actions">
          <button class="btn btn-ghost btn-sm" id="backPhoto">← 重拍照片</button>
          <button class="btn btn-primary" id="sendAd">遞出廣告，向租客發表 →</button>
        </div>
      </div>
      <div>
        ${posterHtml()}
        <div class="panel-actions" style="justify-content:center">
          <button class="btn btn-ghost btn-sm" id="dlBtn">⬇ 下載廣告圖</button>
        </div>
      </div>
    </div>
  </section>`;
}

function posterHtml() {
  const a = state.ad, c = state.client, s = state.spot;
  const today = new Date();
  const d = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
  const facs = state.facilities.map(f => `<li><b>${esc(f.facility)}</b>（原為${esc(f.obj)}）——${esc(f.note)}</li>`).join('');
  return `<div class="poster" id="posterCard">
    <div class="poster-head"><span class="b-name">巖來如此・非人類住宅招租廣告</span><span class="b-no">${esc(state.adNo)}</span></div>
    <div class="poster-title">${a.name ? esc(a.name) : '（未命名住宅）'}</div>
    <div class="poster-slogan">${a.slogan ? '「' + esc(a.slogan) + '」' : ''}</div>
    <div class="poster-photo"><figure class="polaroid">
      <div class="ph-wrap">${photoSceneSvg(true)}${lightOverlayHtml(state.photo.light)}</div>
      <figcaption>入住形象照｜寶藏巖 · ${esc(s.name)}</figcaption>
    </figure></div>
    <div class="poster-section"><h4>推薦租客</h4>
      <div class="poster-tenant">${puppetSvg(c.id)}
        <div><div class="pt-name">${esc(c.name)}</div><div class="pt-sub">${esc(c.species)}｜${esc(c.title)}｜${esc(c.budget)}</div></div>
      </div>
    </div>
    <div class="poster-section"><h4>特色設施</h4><ul>${facs}</ul></div>
    <div class="poster-section"><h4>推薦理由</h4><div class="ps-body">${esc(a.reason) || '（尚未填寫）'}</div></div>
    <div class="poster-section"><h4>房仲提醒</h4><div class="ps-body">${esc(a.notice) || '（尚未填寫）'}</div></div>
    <div class="poster-foot">
      <div class="pf-note">巖來如此居住調查局 · 保留最終解釋權（大概）<br>寶藏巖聚落 · ${d}</div>
      ${sealSvg(84)}
    </div>
  </div>`;
}

function revealHtml() {
  const c = state.client;
  const score = computeScore();
  const stars = starsOf(score);
  const { covered, missed, violated } = matchInfo();
  const starsRow = [1, 2, 3, 4, 5].map(i => starSvg(i <= stars)).join('');
  const bkNeed = `<span>需求滿足</span><span class="bk-v ${covered.length === c.needs.length ? 'ok' : ''}">${covered.length} / ${c.needs.length}${missed.length ? '（缺：' + missed.join('、') + '）' : ''}</span>`;
  const bkTaboo = `<span>禁忌迴避</span><span class="bk-v ${violated.length ? 'bad' : 'ok'}">${violated.length ? '命中禁忌：' + violated.join('、') : '完全避開 ✓'}</span>`;
  const bkFac = `<span>轉譯創意</span><span class="bk-v ok">+${state.facilities.length * 5} 分（${state.facilities.length} 項設施）</span>`;
  const bkScore = `<span>綜合評分</span><span class="bk-v">${score} 分</span>`;
  return `<section class="reveal-wrap">
    <div class="stars-row">${starsRow}</div>
    <div class="star-label">${STAR_LABEL[stars]}</div>
    <div class="letter">
      <p>${LETTERS[c.id][stars]}</p>
      <p class="from">—— ${esc(c.name)} 敬上</p>
    </div>
    <div class="card breakdown">
      <h3>委託結果報告</h3>
      <div class="bk-row">${bkNeed}</div>
      <div class="bk-row">${bkTaboo}</div>
      <div class="bk-row">${bkFac}</div>
      <div class="bk-row">${bkScore}</div>
    </div>
    <div class="panel-actions" style="justify-content:center">
      <button class="btn btn-primary" id="againBtn">再接一筆委託</button>
    </div>
  </section>`;
}

/* ---------- 渲染 ---------- */

function render() {
  let body = '';
  switch (state.phase) {
    case 'title': body = titleHtml(); break;
    case 'draw': body = drawHtml(); break;
    case 'explore': body = state.spot ? exploreDetailHtml() : exploreMapHtml(); break;
    case 'translate': body = state.sub === 'photo' ? translatePhotoHtml() : translateFacHtml(); break;
    case 'ad': body = adHtml(); break;
    case 'reveal': body = revealHtml(); break;
  }
  $('#app').innerHTML = hudHtml() + body;
  bindPhase();
  window.scrollTo(0, 0);
}

function bindPhase() {
  const on = (sel, fn) => { const el = $(sel); if (el) el.addEventListener('click', fn); };
  const muteBtn = $('#muteBtn');
  if (muteBtn) muteBtn.addEventListener('click', () => { state.muted = !state.muted; SFX.click(); render(); });

  switch (state.phase) {
    case 'title':
      on('#startBtn', () => { SFX.click(); newCommission(); });
      break;

    case 'draw': {
      $$('.tcard').forEach(tc => tc.addEventListener('click', () => {
        if (tc.classList.contains('flipped')) return;
        if (state.drawnClient) return;
        const c = state.deck[+tc.dataset.i];
        state.drawnClient = c;
        tc.classList.add('flipped');
        SFX.flip();
        setTimeout(() => { $('#clientPanel').innerHTML = clientPanelHtml(); bindDrawPanel(); }, 620);
      }));
      bindDrawPanel();
      break;
    }

    case 'explore': {
      if (!state.spot) {
        $$('.marker, .spot-card').forEach(el => el.addEventListener('click', () => {
          SFX.click();
          state.spot = SPOTS.find(s => s.id === el.dataset.spot);
          state.visited.add(state.spot.id);
          render();
        }));
      } else {
        on('#backMap', () => { SFX.click(); state.spot = null; render(); });
        on('#pickSpot', () => {
          if (state.visited.size < 3) { toast(`請先勘查至少 3 處（目前 ${state.visited.size} 處）`); return; }
          SFX.stamp();
          state.phase = 'translate'; state.sub = 'fac';
          render();
        });
      }
      break;
    }

    case 'translate': {
      if (state.sub === 'fac') {
        $$('.fac-card').forEach(fc => fc.addEventListener('click', () => {
          const e = state.spot.elements[+fc.dataset.i];
          const i = state.facilities.indexOf(e);
          if (i >= 0) { state.facilities.splice(i, 1); SFX.click(); }
          else if (state.facilities.length >= 3) { toast('最多只能列 3 項特色設施'); return; }
          else { state.facilities.push(e); SFX.select(); }
          render();
        }));
        on('#toPhoto', () => {
          if (!state.facilities.length) { toast('請至少選 1 項設施'); return; }
          SFX.click(); state.sub = 'photo'; render();
        });
      } else {
        bindPhoto();
      }
      break;
    }

    case 'ad': {
      on('#nameBtn', () => { SFX.click(); state.ad.name = pick(NAME_BANK[state.spot.id], state.ad.name); $('#adName').value = state.ad.name; refreshPoster(); });
      on('#sloganBtn', () => { SFX.click(); state.ad.slogan = pick(SLOGAN_BANK[state.client.id], state.ad.slogan); $('#adSlogan').value = state.ad.slogan; refreshPoster(); });
      ['adName', 'adSlogan', 'adReason', 'adNotice'].forEach(id => {
        $('#' + id).addEventListener('input', e => {
          state.ad[{ adName: 'name', adSlogan: 'slogan', adReason: 'reason', adNotice: 'notice' }[id]] = e.target.value;
          refreshPoster();
        });
      });
      on('#backPhoto', () => { SFX.click(); state.phase = 'translate'; state.sub = 'photo'; state.photo.captured = false; render(); });
      on('#sendAd', () => { SFX.stamp(); state.phase = 'reveal'; render(); if (starsOf(computeScore()) >= 4) SFX.success(); else if (starsOf(computeScore()) <= 2) SFX.sad(); });
      on('#dlBtn', () => { SFX.click(); downloadPoster(); });
      break;
    }

    case 'reveal':
      on('#againBtn', () => { SFX.click(); state.completed++; newCommission(); });
      break;
  }
}

function bindDrawPanel() {
  const on = (sel, fn) => { const el = $(sel); if (el) el.addEventListener('click', fn); };
  on('#acceptBtn', () => {
    SFX.stamp();
    state.client = state.drawnClient;
    state.phase = 'explore'; state.spot = null;
    render();
  });
  on('#redrawBtn', () => {
    if (state.redrawn) return;
    SFX.flip();
    state.redrawn = true;
    state.deck = shuffle(CLIENTS.filter(c => c.id !== state.drawnClient.id));
    state.drawnClient = null;
    render();
    toast('已重新洗牌，再抽一次吧');
  });
}

function refreshPoster() {
  const box = $('#posterCard');
  if (box) box.outerHTML = posterHtml();
}

/* ---------- 借位攝影互動 ---------- */

function bindPhoto() {
  const svg = $('#photoScene'), frame = $('#photoFrame'), ov = frame.querySelector('.light-overlay');
  const puppet = svg.querySelector('#puppetUse');
  const sizeCtl = $('#pupSize'), seg = $('#lightSeg');
  let dragging = false;

  const toSvgPt = e => {
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };
  const apply = () => {
    const p = state.photo;
    puppet.setAttribute('transform', `translate(${p.x} ${p.y}) scale(${p.scale})`);
    ov.style.setProperty('--fx', (p.x / 480 * 100).toFixed(1) + '%');
    ov.style.setProperty('--fy', (p.y / 360 * 100).toFixed(1) + '%');
  };
  apply();

  svg.addEventListener('pointerdown', e => {
    if (e.target.closest('#puppetUse')) { dragging = true; svg.setPointerCapture(e.pointerId); e.preventDefault(); }
  });
  svg.addEventListener('pointermove', e => {
    if (!dragging) return;
    const p = toSvgPt(e);
    state.photo.x = Math.max(24, Math.min(456, p.x));
    state.photo.y = Math.max(40, Math.min(344, p.y));
    apply();
  });
  const stop = () => { dragging = false; };
  svg.addEventListener('pointerup', stop);
  svg.addEventListener('pointercancel', stop);

  sizeCtl.addEventListener('input', e => { state.photo.scale = +e.target.value; apply(); });

  seg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    state.photo.light = b.dataset.light;
    seg.querySelectorAll('button').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    ov.className = 'light-overlay lo-' + state.photo.light;
    SFX.click();
  }));

  const shutter = $('#shutterBtn'), flash = $('#flash');
  shutter.addEventListener('click', () => {
    SFX.shutter();
    flash.classList.add('go');
    setTimeout(() => flash.classList.remove('go'), 520);
    setTimeout(() => {
      state.photo.captured = true;
      const res = $('#photoResult');
      res.innerHTML = capturedHtml();
      bindCaptured();
      res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 420);
  });
}

function bindCaptured() {
  const on = (sel, fn) => { const el = $(sel); if (el) el.addEventListener('click', fn); };
  on('#retakeBtn', () => { SFX.click(); state.photo.captured = false; $('#photoResult').innerHTML = ''; });
  on('#usePhotoBtn', () => {
    SFX.stamp();
    state.ad.reason = autoReason();
    state.ad.notice = autoNotice();
    if (!state.ad.name) state.ad.name = pick(NAME_BANK[state.spot.id]);
    if (!state.ad.slogan) state.ad.slogan = pick(SLOGAN_BANK[state.client.id]);
    state.phase = 'ad';
    render();
  });
}

/* ---------- 新委託 ---------- */

function newCommission() {
  state.client = null; state.spot = null; state.facilities = [];
  state.visited = new Set();
  state.photo = { x: 240, y: 250, scale: 1, light: 'noon', captured: false };
  state.ad = { name: '', slogan: '', reason: '', notice: '' };
  state.deck = shuffle(CLIENTS); state.drawnClient = null; state.redrawn = false;
  state.adNo = '委託編號 BY-' + String(state.completed + 1).padStart(2, '0');
  state.phase = 'draw'; state.sub = 'fac';
  render();
}

/* ---------- 廣告下載（Canvas） ---------- */

function wrapText(x, text, x0, x1, y, lineH) {
  const lines = [];
  let cur = '';
  for (const ch of String(text)) {
    if (ch === '\n') { lines.push(cur); cur = ''; continue; }
    if (x.measureText(cur + ch).width > x1 - x0) { lines.push(cur); cur = ch; } else cur += ch;
  }
  if (cur) lines.push(cur);
  lines.forEach((l, i) => x.fillText(l, x0, y + i * lineH));
  return y + lines.length * lineH;
}

function svgToImage(svgStr) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
  });
}

async function downloadPoster() {
  try {
    await document.fonts.ready;
    const W = 860, H = 1240;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    const a = state.ad, cl = state.client, sp = state.spot;

    x.fillStyle = '#faf5e4'; x.fillRect(0, 0, W, H);
    x.strokeStyle = 'rgba(140,60,40,.4)'; x.lineWidth = 1.5; x.strokeRect(14, 14, W - 28, H - 28);

    x.fillStyle = '#33302a'; x.font = '700 24px "Noto Sans TC", sans-serif'; x.textAlign = 'left';
    x.fillText('巖來如此・非人類住宅招租廣告', 40, 62);
    x.textAlign = 'right'; x.fillStyle = '#8a8474'; x.font = '15px "Noto Sans TC", sans-serif';
    x.fillText(state.adNo, W - 40, 60);
    x.strokeStyle = '#33302a'; x.lineWidth = 2;
    x.beginPath(); x.moveTo(40, 78); x.lineTo(W - 40, 78); x.stroke();

    x.textAlign = 'center'; x.fillStyle = '#33302a'; x.font = '700 50px "LXGW WenKai TC", "Noto Sans TC", serif';
    x.fillText(a.name || '（未命名住宅）', W / 2, 142);
    x.fillStyle = '#8f4530'; x.font = '26px "LXGW WenKai TC", "Noto Sans TC", serif';
    x.fillText(a.slogan ? '「' + a.slogan + '」' : '', W / 2, 182);

    const pw = 500, ph = 375, px = (W - pw) / 2, py = 205;
    x.fillStyle = '#fdfaf0'; x.fillRect(px - 14, py - 14, pw + 28, ph + 28 + 44);
    x.strokeStyle = '#d8d0ba'; x.strokeRect(px - 14, py - 14, pw + 28, ph + 28 + 44);
    const photo = await svgToImage(photoSceneSvg(true));
    x.drawImage(photo, px, py, pw, ph);
    // 光線
    x.save(); x.beginPath(); x.rect(px, py, pw, ph); x.clip();
    if (state.photo.light === 'morning') {
      const g = x.createRadialGradient(px + pw * 0.2, py + ph * 0.15, 10, px + pw * 0.2, py + ph * 0.15, pw * 0.8);
      g.addColorStop(0, 'rgba(240,200,90,0.45)'); g.addColorStop(0.55, 'rgba(240,200,90,0.1)'); g.addColorStop(1, 'rgba(240,200,90,0)');
      x.fillStyle = g; x.fillRect(px, py, pw, ph);
    } else if (state.photo.light === 'dusk') {
      x.globalCompositeOperation = 'multiply';
      x.fillStyle = 'rgba(120,100,150,0.5)'; x.fillRect(px, py, pw, ph);
      x.globalCompositeOperation = 'source-over';
    } else if (state.photo.light === 'torch') {
      const fx = px + state.photo.x / 480 * pw, fy = py + state.photo.y / 360 * ph;
      const g = x.createRadialGradient(fx, fy, 20, fx, fy, 200);
      g.addColorStop(0, 'rgba(255,240,200,0.3)'); g.addColorStop(0.4, 'rgba(30,26,20,0.15)'); g.addColorStop(1, 'rgba(24,20,14,0.88)');
      x.fillStyle = g; x.fillRect(px, py, pw, ph);
    }
    x.restore();
    x.fillStyle = '#6a6353'; x.font = '22px "LXGW WenKai TC", "Noto Sans TC", serif'; x.textAlign = 'center';
    x.fillText('入住形象照｜寶藏巖 · ' + sp.name, px + pw / 2, py + ph + 32);

    let y = py + ph + 90;
    const sec = (title) => {
      x.textAlign = 'left'; x.fillStyle = '#8f4530'; x.font = '700 20px "Noto Sans TC", sans-serif';
      x.fillText(title, 48, y);
      x.strokeStyle = 'rgba(138,132,116,.6)'; x.lineWidth = 1;
      x.beginPath(); x.moveTo(48 + x.measureText(title).width + 14, y - 6); x.lineTo(W - 48, y - 6); x.stroke();
      y += 34;
    };

    sec('推薦租客');
    const pup = await svgToImage(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-46 -58 92 98">${PUPPETS[cl.id]}</svg>`);
    x.drawImage(pup, 56, y - 24, 84, 90);
    x.fillStyle = '#33302a'; x.font = '700 26px "LXGW WenKai TC", "Noto Sans TC", serif';
    x.fillText(cl.name, 160, y + 4);
    x.fillStyle = '#8a8474'; x.font = '16px "Noto Sans TC", sans-serif';
    x.fillText(`${cl.species}｜${cl.title}｜${cl.budget}`, 160, y + 30);
    y += 78;

    sec('特色設施');
    x.fillStyle = '#5c564a'; x.font = '17px "Noto Sans TC", sans-serif';
    state.facilities.forEach(f => {
      const line = `・${f.facility}（原為${f.obj}）——${f.note}`;
      y = wrapText(x, line, 56, W - 56, y, 26) + 6;
    });
    y += 8;

    sec('推薦理由');
    x.fillStyle = '#5c564a'; x.font = '17px "Noto Sans TC", sans-serif';
    y = wrapText(x, a.reason || '（尚未填寫）', 56, W - 56, y, 26) + 12;

    sec('房仲提醒');
    y = wrapText(x, a.notice || '（尚未填寫）', 56, W - 56, y, 26) + 12;

    // 印章
    x.save(); x.translate(W - 118, H - 118); x.rotate(0.12);
    x.fillStyle = '#c0392b'; x.beginPath(); x.arc(0, 0, 46, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#f6ecd8'; x.lineWidth = 2; x.setLineDash([4, 3]);
    x.beginPath(); x.arc(0, 0, 38, 0, Math.PI * 2); x.stroke(); x.setLineDash([]);
    x.fillStyle = '#f6ecd8'; x.font = '700 40px "LXGW WenKai TC", serif'; x.textAlign = 'center';
    x.fillText('巖', 0, 14); x.restore();

    x.textAlign = 'left'; x.fillStyle = '#8a8474'; x.font = '13px "Noto Sans TC", sans-serif';
    x.fillText('巖來如此居住調查局 · 保留最終解釋權（大概）', 48, H - 56);
    x.fillText('寶藏巖聚落', 48, H - 36);

    const url = c.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url; link.download = '巖來如此_招租廣告.png'; link.click();
    toast('廣告已下載');
  } catch (err) {
    toast('此環境不支援圖片下載，請直接截圖保存廣告畫面');
  }
}

/* ---------- 啟動 ---------- */

render();
