/* 巖來如此 — 寶藏巖非人類居住調查局：遊戲資料 */

const NEED_DESC = {
  隱蔽: '絕佳的隱蔽性', 平坦: '平坦好走的動線', 安靜: '安靜無擾的環境',
  潮濕: '穩定濕潤的水氣', 陰涼: '天然陰涼的微氣候', 植物: '滿滿的綠意植被',
  高處: '居高臨下的位置', 視野: '開闊無遮的視野'
};

const TABOO_WARN = {
  易被發現: '本區視野開闊、遮蔽有限，請自備保護色。',
  陡峭: '本區地勢較陡，行動慢的住民請先評估體力。',
  震動: '本區偶有人類腳步與風動搖晃，怕震住民請留意。',
  乾燥: '本區部分角落較為乾燥，請定期補水保濕。',
  曝曬: '本區部分時段有直射陽光，怕曬住民請避開正午。',
  封閉: '本區部分角落視線受阻，需要視野的住民請留意。'
};

const RULES = [
  '請與既有住民（蜘蛛、蜥蜴、苔蘚）和平共處——他們是房東，不是房客。',
  '人類日間活動頻繁，夜行住民請自備安眠葉。',
  '颱風季請確實檢查根系、屋頂與錨點，調查局不負責救援飛走的屋頂。',
  '本聚落嚴禁使用殺蟲劑——這裡的蟲是鄰居，不是害蟲。',
  '搬入前請向調查局登記，以便寄送鄰里通訊（由風遞送）。'
];

const NAME_BANK = {
  stairs: ['六十階之上', '垂直長城小築', '階梯盡頭別館', '青苔階地公寓'],
  pipes: ['管中窺豹公寓', '微光隧道套房', '三管巷一號', '凝水雅居'],
  roots: ['根深蒂固山居', '樹洞裡的回音', '老榕一樓', '落葉軟墊之家'],
  roof: ['全村最高景觀苑', '天線之丘', '溪景第一排', '曬被陽台'],
  ditch: ['苔蘚河岸華廈', '濕意江南', '綠絨水岸', '軟泥溫宅'],
  pots: ['陶土獨棟', '藤蔓小院', '盆底下的祕密', '裂縫即是門']
};

const SLOGAN_BANK = {
  mouse: ['找不到的，才是家。', '在這裡，連影子都會迷路。', '貓經過三次，沒發現你一次。'],
  snail: ['人生慢慢來，坡道緩緩爬。', '這裡的安靜，比你的殼還完整。', '沒有階梯，只有生活。'],
  frog: ['全年保濕，出門不用面膜。', '涼蔭、綠意、水聲——三合一景觀宅。', '陽光是別人家的事。'],
  bird: ['推開窗，就是整條新店溪。', '沒有牆的世界，才有風。', '站得高，不是驕傲，是本能。']
};

const STAR_LABEL = { 5: '完美成交', 4: '心動委託', 3: '猶豫觀望', 2: '大幅議價', 1: '委託失敗' };

const LETTERS = {
  mouse: {
    5: '「合約我簽了，用鬍鬚沾墨水。你甚至找不到我把合約藏哪了——這就是好房子。」',
    4: '「很不錯。搬進去之前我會先挖三條逃生通道，這是稱讚。」',
    3: '「可以考慮，但我得先確認那隻貓的巡邏路線。讓我想想。」',
    2: '「太多眼睛了。這裡連我的尾巴都藏不住。」',
    1: '「不好意思，這間房子……我已經被發現三次了。再見。」'
  },
  snail: {
    5: '「我已經出發了。照我的速度，下個月雨季前會到。請先把葉子鋪好。」',
    4: '「殼很滿意，坡度很滿意，安靜——非常滿意。」',
    3: '「還不錯，但我聽到遠處有腳步聲。讓我再觀察一個季節。」',
    2: '「太陡、太晃。我搬一次家要三個月，不想搬到一半滾下來。」',
    1: '「這個坡度……我的殼會比我先抵達谷底。告辭。」'
  },
  frog: {
    5: '「皮膚測試通過：涼、濕、綠。今晚我就要唱一整夜情歌，別攔我。」',
    4: '「保濕到位，植物友善。我考慮在此定居……阿不，產卵也可以。」',
    3: '「還可以，但那塊曬得到太陽的地方，請幫我列為禁區。」',
    2: '「有點乾。我的皮膚開始癢了，這不是好預兆。」',
    1: '「這裡比曬青蛙乾的工廠還乾。告辭，我要去找水溝。」'
  },
  bird: {
    5: '「視野無敵。從這裡能看見新店溪轉彎的地方。築巢材料我已經叼來了。」',
    4: '「風很好，風景很好，牆很少。可以。」',
    3: '「高度可以，但那個角落被擋住了。我需要一點時間重新規劃航線。」',
    2: '「視線被牆切得零零碎碎，飛出去會撞到自己的心事。」',
    1: '「到處都是牆。這不是給鳥住的房子，是給盒子住的。再見。」'
  }
};

const CLIENTS = [
  {
    id: 'mouse', species: '老鼠', name: '米粒太太', title: '夜行藏匿系住民',
    needs: ['隱蔽'], taboos: ['易被發現'],
    intro: '「我找房只有一個條件：誰都找不到。貓找不到、人類找不到，最好連我自己都要找一下。」',
    budget: '月租：三顆花生（可議）'
  },
  {
    id: 'snail', species: '蝸牛', name: '阿慢先生', title: '慢活緩坡系住民',
    needs: ['平坦', '安靜'], taboos: ['陡峭', '震動'],
    intro: '「我搬家一次要三個月。所以這次，我要找一個不用再搬的地方——平坦、安靜，沒有人在我頭上跺腳。」',
    budget: '月租：一片嫩葉（新鮮的）'
  },
  {
    id: 'frog', species: '青蛙', name: '咕咕小姐', title: '保濕陰涼系住民',
    needs: ['潮濕', '陰涼', '植物'], taboos: ['乾燥', '曝曬'],
    intro: '「乾燥會讓我失眠，陽光會讓我變成青蛙乾。我要一個摸起來永遠涼涼、抬頭就是葉子的地方。」',
    budget: '月租：蚊子一打（活體）'
  },
  {
    id: 'bird', species: '小鳥', name: '飛飛同學', title: '高空景觀系住民',
    needs: ['高處', '視野'], taboos: ['封閉'],
    intro: '「牆壁是很可怕的東西——它擋住風、擋住河、擋住整座城市。我要住在看得見新店溪的地方。」',
    budget: '月租：兩顆漿果＋一根亮晶晶的線'
  }
];

/* ---------------- 場景插畫（SVG，viewBox 480x360） ---------------- */

function stairsPoints() {
  const pts = [[400, 225]]; let x = 400, y = 225;
  for (let i = 0; i < 10; i++) { x -= 32; pts.push([x, y]); y += 11; pts.push([x, y]); }
  return pts.map(p => p.join(',')).join(' ');
}
function railPoints() {
  const pts = [[400, 203]]; let x = 400, y = 203;
  for (let i = 0; i < 10; i++) { x -= 32; pts.push([x, y]); y += 11; pts.push([x, y]); }
  return pts.map(p => p.join(',')).join(' ');
}
function railPosts() {
  let x = 400, y = 203, out = '';
  for (let i = 0; i < 10; i++) {
    x -= 32; out += `<line x1="${x + 16}" y1="${y}" x2="${x + 16}" y2="${y + 22}" stroke="#5d4a3c" stroke-width="2.5"/>`;
    y += 11;
  }
  return out;
}
function mossCluster(cx, cy, n, r, fill) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + i;
    out += `<circle cx="${(cx + Math.cos(a) * r).toFixed(1)}" cy="${(cy + Math.sin(a) * r * 0.6).toFixed(1)}" r="${(r * 0.5).toFixed(1)}" fill="${fill}"/>`;
  }
  return out;
}
function vineLeaf(x, y, s, rot) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0 C6 -4 12 -4 14 2 C12 8 4 8 0 0 Z" fill="#6e8a5e"/><path d="M0 0 C6 -4 12 -4 14 2" stroke="#4d6b45" stroke-width="1" fill="none"/></g>`;
}
function grassTuft(x, y, c) {
  return `<path d="M${x} ${y} q-3 -8 -6 -10 M${x} ${y} q0 -9 0 -12 M${x} ${y} q3 -8 6 -10" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}
function houseSvg(x, y, w, h, wall, roof, roofH) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${wall}"/>
    <path d="M${x - 6} ${y} L${x + w / 2} ${y - roofH} L${x + w + 6} ${y} Z" fill="${roof}"/>
    <rect x="${x + w * 0.18}" y="${y + h * 0.25}" width="${w * 0.18}" height="${h * 0.2}" fill="#5d4a3c"/>
    <rect x="${x + w * 0.6}" y="${y + h * 0.25}" width="${w * 0.18}" height="${h * 0.2}" fill="#e3b23c"/>`;
}

const SCENES = {};

SCENES.stairs = `
<rect width="480" height="360" fill="#e7e0ca"/>
<circle cx="390" cy="72" r="30" fill="#e3b23c" opacity="0.9"/>
<ellipse cx="110" cy="62" rx="40" ry="11" fill="#f2ecd8"/>
<ellipse cx="146" cy="72" rx="26" ry="8" fill="#f2ecd8"/>
<path d="M0 200 L110 128 250 208 480 148 480 360 0 360 Z" fill="#93a878"/>
<path d="M0 248 C150 214 300 258 480 224 L480 360 0 360 Z" fill="#6e8a5e"/>
${houseSvg(296, 128, 54, 40, '#c8b29a', '#8a5f4b', 22)}
${houseSvg(358, 140, 46, 34, '#b4593a', '#5d4a3c', 20)}
${houseSvg(416, 150, 40, 30, '#c8b29a', '#8a5f4b', 18)}
<polyline points="${stairsPoints()}" fill="none" stroke="#c9bfa5" stroke-width="13" stroke-linejoin="miter"/>
<polyline points="${stairsPoints()}" fill="none" stroke="#a99d86" stroke-width="13" stroke-linejoin="miter" stroke-dasharray="13 260"/>
${railPosts()}
<polyline points="${railPoints()}" fill="none" stroke="#5d4a3c" stroke-width="3.5" stroke-linejoin="miter"/>
${mossCluster(340, 250, 5, 9, '#4d6b45')}
${mossCluster(245, 300, 6, 11, '#6e8a5e')}
${mossCluster(160, 340, 5, 9, '#4d6b45')}
<circle cx="52" cy="318" r="20" fill="#4d6b45"/><circle cx="80" cy="326" r="16" fill="#6e8a5e"/><circle cx="36" cy="330" r="14" fill="#6e8a5e"/>
<g transform="translate(268 262)"><ellipse rx="5" ry="4" fill="#c0392b"/><circle cx="-3.5" cy="-2.5" r="1.6" fill="#33302a"/><circle cx="1" cy="-3.5" r="1.2" fill="#33302a"/><circle cx="4" cy="-2" r="1.6" fill="#33302a"/></g>
${grassTuft(120, 356, '#4d6b45')}${grassTuft(300, 358, '#4d6b45')}${grassTuft(420, 352, '#4d6b45')}`;

SCENES.pipes = `
<rect width="480" height="360" fill="#b5ae9d"/>
<rect x="0" y="0" width="480" height="70" fill="#a8a190" opacity="0.5"/>
<rect x="330" y="40" width="90" height="60" fill="#a8a190" opacity="0.5" rx="6"/>
<rect x="40" y="120" width="70" height="50" fill="#a8a190" opacity="0.5" rx="6"/>
<rect x="0" y="312" width="480" height="48" fill="#8b9377"/>
<g>
  <rect x="24" y="92" width="432" height="24" rx="12" fill="#7f8b93"/>
  <circle cx="90" cy="104" r="15" fill="#6d7880"/><circle cx="250" cy="104" r="15" fill="#6d7880"/><circle cx="410" cy="104" r="15" fill="#6d7880"/>
  <rect x="60" y="80" width="10" height="48" fill="#5d6a72"/><rect x="300" y="80" width="10" height="48" fill="#5d6a72"/>
</g>
<g>
  <rect x="24" y="172" width="432" height="28" rx="14" fill="#8a948a"/>
  <circle cx="150" cy="186" r="17" fill="#727d73"/><circle cx="360" cy="186" r="17" fill="#727d73"/>
  <rect x="210" y="160" width="10" height="52" fill="#5d6a5f"/><rect x="430" y="160" width="10" height="52" fill="#5d6a5f"/>
  <circle cx="252" cy="204" r="3" fill="#7ba7b0"/><circle cx="268" cy="208" r="2.5" fill="#7ba7b0"/><circle cx="300" cy="202" r="3" fill="#7ba7b0"/>
  <path d="M252 196 q1 -8 0 -14" stroke="#7ba7b0" stroke-width="2.5" fill="none"/>
</g>
<g>
  <rect x="24" y="252" width="432" height="22" rx="11" fill="#97867a"/>
  <circle cx="200" cy="263" r="14" fill="#7e6f64"/><circle cx="380" cy="263" r="14" fill="#7e6f64"/>
  <rect x="120" y="244" width="9" height="40" fill="#665a50"/>
</g>
<g transform="translate(70 312)">
  <ellipse cx="0" cy="0" rx="16" ry="34" fill="#4d6b45" transform="rotate(-24)"/>
  <ellipse cx="18" cy="6" rx="14" ry="30" fill="#6e8a5e" transform="rotate(8)"/>
  <ellipse cx="-14" cy="10" rx="12" ry="26" fill="#4d6b45" transform="rotate(-48)"/>
  <path d="M-10 -28 L-6 -44 M14 -22 L20 -38" stroke="#4d6b45" stroke-width="4" stroke-linecap="round"/>
</g>
<g transform="translate(420 60)">
  <path d="M0 0 A26 26 0 0 1 20 14 M0 0 A18 18 0 0 1 14 10 M0 0 A34 34 0 0 1 26 18" stroke="#f6f1de" stroke-width="1.6" fill="none" opacity="0.8"/>
</g>
${grassTuft(160, 340, '#4d6b45')}${grassTuft(330, 344, '#4d6b45')}${grassTuft(450, 348, '#4d6b45')}
<circle cx="390" cy="300" r="4" fill="#c0392b"/><circle cx="390" cy="292" r="1.5" fill="#33302a"/>`;

SCENES.roots = `
<rect width="480" height="360" fill="#dfd8c2"/>
<path d="M480 0 L480 360 210 360 Q262 190 310 0 Z" fill="#a49f92"/>
<path d="M310 0 Q340 120 210 360" stroke="#96907f" stroke-width="3" fill="none" opacity="0.6"/>
<path d="M360 60 Q390 200 300 360" stroke="#96907f" stroke-width="3" fill="none" opacity="0.5"/>
<path d="M60 0 C90 80 70 160 40 240 L74 250 C104 160 122 80 96 0 Z" fill="#6b5644"/>
<path d="M40 240 C60 282 140 302 190 264" stroke="#6b5644" stroke-width="11" fill="none" stroke-linecap="round"/>
<path d="M55 232 C110 322 205 332 240 302" stroke="#5d4a3c" stroke-width="8" fill="none" stroke-linecap="round"/>
<path d="M58 244 C120 252 168 252 198 264 C184 320 108 336 68 302 C56 284 52 262 58 244 Z" fill="#35322c"/>
<path d="M330 120 q2 10 0 20" stroke="#7ba7b0" stroke-width="3" fill="none"/>
<ellipse cx="330" cy="150" rx="4" ry="6" fill="#7ba7b0"/>
<ellipse cx="290" cy="90" rx="4" ry="6" fill="#7ba7b0"/>
<g transform="translate(120 300) rotate(-14)"><ellipse rx="11" ry="5" fill="#a9814f"/></g>
<g transform="translate(160 330) rotate(20)"><ellipse rx="12" ry="5.5" fill="#8f6b40"/></g>
<g transform="translate(210 348) rotate(-8)"><ellipse rx="10" ry="4.5" fill="#a9814f"/></g>
<g transform="translate(255 320) rotate(30)"><ellipse rx="11" ry="5" fill="#8f6b40"/></g>
<g transform="translate(105 340) rotate(6)"><ellipse rx="10" ry="4.5" fill="#8f6b40"/></g>
<g transform="translate(150 282)">
  <path d="M0 0 Q-8 -22 -20 -30 M0 0 Q0 -26 2 -34 M0 0 Q10 -22 22 -28" stroke="#4d6b45" stroke-width="3" fill="none" stroke-linecap="round"/>
</g>
<g transform="translate(420 340)">
  <path d="M0 0 Q-8 -20 -18 -26 M0 0 Q2 -24 4 -30 M0 0 Q10 -18 20 -24" stroke="#6e8a5e" stroke-width="3" fill="none" stroke-linecap="round"/>
</g>
${mossCluster(390, 300, 6, 12, '#6e8a5e')}
${mossCluster(430, 200, 5, 10, '#4d6b45')}
<g transform="translate(390 130)"><ellipse rx="4" ry="3.2" fill="#c0392b"/><circle cx="-2.5" cy="-2" r="1.2" fill="#33302a"/><circle cx="2.5" cy="-1.5" r="1.2" fill="#33302a"/></g>`;

SCENES.roof = `
<rect width="480" height="360" fill="#e7dcc8"/>
<circle cx="110" cy="76" r="26" fill="#e3b23c"/>
<path d="M0 156 h34 v-16 h22 v16 h26 v-26 h24 v26 h30 v-14 h26 v14 h40 v-22 h24 v22 h36 v-12 h28 v12 h40 v-18 h26 v18 h48 v-10 h32 v10 h34 v-14 h30 v14 h26 Z" fill="#a8a29a" opacity="0.75"/>
<path d="M0 176 Q120 166 240 174 T480 170 L480 214 0 214 Z" fill="#7ba7b0"/>
<path d="M40 188 Q160 182 300 188 M180 198 Q320 194 440 198" stroke="#9dc0c8" stroke-width="3" fill="none"/>
${houseSvg(30, 250, 74, 62, '#c8b29a', '#8a5f4b', 26)}
${houseSvg(118, 234, 62, 78, '#b4593a', '#5d4a3c', 24)}
${houseSvg(196, 272, 82, 52, '#c8b29a', '#8a5f4b', 26)}
${houseSvg(298, 256, 68, 66, '#b96a4a', '#5d4a3c', 24)}
${houseSvg(382, 280, 80, 46, '#c8b29a', '#8a5f4b', 24)}
${houseSvg(258, 222, 56, 52, '#b4593a', '#5d4a3c', 22)}
<rect x="0" y="304" width="480" height="56" fill="#6e8a5e"/>
<line x1="286" y1="222" x2="286" y2="112" stroke="#5d4a3c" stroke-width="5"/>
<line x1="262" y1="128" x2="310" y2="128" stroke="#5d4a3c" stroke-width="4"/>
<line x1="268" y1="148" x2="304" y2="148" stroke="#5d4a3c" stroke-width="3"/>
<circle cx="298" cy="118" r="7" fill="#96907f"/>
<path d="M286 132 C340 190 400 170 460 210" stroke="#5d4a3c" stroke-width="2" fill="none"/>
<path d="M286 152 C330 200 380 240 430 268" stroke="#5d4a3c" stroke-width="2" fill="none"/>
<rect x="140" y="212" width="36" height="26" rx="5" fill="#98b3b8"/>
<line x1="146" y1="238" x2="146" y2="250" stroke="#5d4a3c" stroke-width="3"/>
<line x1="172" y1="238" x2="172" y2="250" stroke="#5d4a3c" stroke-width="3"/>
<path d="M60 262 C140 282 200 272 258 286" stroke="#5d4a3c" stroke-width="2" fill="none"/>
<rect x="140" y="272" width="30" height="22" fill="#d8cbb0" transform="rotate(6 155 283)"/>
<rect x="188" y="278" width="24" height="18" fill="#c9b29a" transform="rotate(-4 200 287)"/>
<path d="M70 92 q6 -7 12 0 q6 -7 12 0" stroke="#5c564a" stroke-width="2" fill="none"/>
<path d="M330 66 q6 -7 12 0 q6 -7 12 0" stroke="#5c564a" stroke-width="2" fill="none"/>
<g transform="translate(60 320)"><circle r="5" fill="#c0392b"/><circle cx="-3" cy="-2" r="1.5" fill="#33302a"/><circle cx="3" cy="-2" r="1.5" fill="#33302a"/></g>
${grassTuft(240, 356, '#4d6b45')}${grassTuft(430, 352, '#4d6b45')}`;

SCENES.ditch = `
<rect width="480" height="360" fill="#b5ae9d"/>
<rect x="0" y="0" width="480" height="96" fill="#a8a190" opacity="0.5"/>
<rect x="0" y="300" width="480" height="60" fill="#8b9377"/>
<path d="M120 360 L215 178 305 178 380 360 Z" fill="#8a948a"/>
<path d="M226 360 L240 196 278 196 292 360 Z" fill="#7ba7b0"/>
<path d="M238 320 L246 210 252 210 246 320 Z" fill="#9dc0c8" opacity="0.7"/>
<path d="M248 280 q6 8 0 16" stroke="#9dc0c8" stroke-width="2" fill="none"/>
${mossCluster(160, 250, 6, 13, '#6e8a5e')}
${mossCluster(330, 240, 6, 13, '#6e8a5e')}
${mossCluster(210, 300, 7, 15, '#4d6b45')}
${mossCluster(300, 310, 7, 15, '#4d6b45')}
${mossCluster(90, 330, 6, 14, '#6e8a5e')}
${mossCluster(410, 330, 6, 14, '#6e8a5e')}
${mossCluster(260, 190, 5, 10, '#93a878')}
<ellipse cx="70" cy="290" rx="22" ry="12" fill="#96907f"/>
<ellipse cx="415" cy="300" rx="26" ry="13" fill="#96907f"/>
<ellipse cx="360" cy="180" rx="16" ry="9" fill="#96907f"/>
<g transform="translate(50 220)">
  <rect x="-3" y="-16" width="6" height="16" rx="2" fill="#e8dcc0"/>
  <path d="M-14 -14 Q0 -34 14 -14 Q0 -8 -14 -14 Z" fill="#c0392b"/>
  <circle cx="-6" cy="-18" r="2" fill="#f6ecd8"/><circle cx="5" cy="-19" r="2" fill="#f6ecd8"/>
</g>
<g transform="translate(452 240)">
  <path d="M0 0 Q-8 -20 -18 -26 M0 0 Q2 -24 4 -30 M0 0 Q10 -18 20 -24" stroke="#4d6b45" stroke-width="3" fill="none" stroke-linecap="round"/>
</g>
<g transform="translate(335 130)"><ellipse rx="4" ry="3.2" fill="#c0392b"/><circle cx="-2.5" cy="-2" r="1.2" fill="#33302a"/><circle cx="2.5" cy="-1.5" r="1.2" fill="#33302a"/></g>
<g transform="translate(150 200)">
  <line x1="-8" y1="0" x2="8" y2="0" stroke="#5c564a" stroke-width="2"/>
  <line x1="-4" y1="-4" x2="4" y2="-4" stroke="#5c564a" stroke-width="2"/>
</g>
${grassTuft(200, 356, '#4d6b45')}${grassTuft(390, 356, '#4d6b45')}`;

SCENES.pots = `
<rect width="480" height="360" fill="#c4bda9"/>
<rect x="0" y="0" width="480" height="60" fill="#b5ae9d" opacity="0.6"/>
<ellipse cx="90" cy="140" rx="60" ry="26" fill="#b5ae9d" opacity="0.6"/>
<ellipse cx="400" cy="200" rx="70" ry="30" fill="#b5ae9d" opacity="0.6"/>
<rect x="0" y="316" width="480" height="44" fill="#8b9377"/>
<line x1="130" y1="316" x2="180" y2="140" stroke="#8a6b4a" stroke-width="6" stroke-linecap="round"/>
<line x1="230" y1="316" x2="200" y2="140" stroke="#8a6b4a" stroke-width="6" stroke-linecap="round"/>
<line x1="138" y1="250" x2="224" y2="250" stroke="#8a6b4a" stroke-width="4"/>
<line x1="146" y1="200" x2="216" y2="200" stroke="#8a6b4a" stroke-width="4"/>
<path d="M180 140 C170 170 190 190 170 220 C160 240 180 260 165 290" stroke="#4d6b45" stroke-width="3.5" fill="none"/>
<path d="M200 145 C210 180 195 210 215 245 C225 265 210 285 225 310" stroke="#4d6b45" stroke-width="3.5" fill="none"/>
${vineLeaf(172, 170, 1, -20)}${vineLeaf(188, 195, 1.2, 30)}${vineLeaf(163, 235, 1.1, -40)}
${vineLeaf(212, 225, 1, 25)}${vineLeaf(198, 260, 1.2, -15)}${vineLeaf(220, 295, 1, 40)}
${vineLeaf(150, 210, 0.9, -70)}${vineLeaf(232, 200, 0.9, 70)}
<g>
  <rect x="118" y="296" width="62" height="10" fill="#c07a58"/>
  <path d="M124 306 L174 306 L166 354 L132 354 Z" fill="#b96a4a"/>
  <ellipse cx="149" cy="300" rx="24" ry="5" fill="#5d4a3c"/>
</g>
<g>
  <path d="M282 312 L362 312 L354 358 L290 358 Z" fill="#a35c42"/>
  <path d="M282 312 L298 318 L306 308 L318 316 L328 306 L340 314 L350 308 L362 312" stroke="#8f4a34" stroke-width="3" fill="none"/>
  <ellipse cx="322" cy="316" rx="26" ry="5" fill="#5d4a3c"/>
  <path d="M318 314 Q314 300 322 292" stroke="#4d6b45" stroke-width="3" fill="none"/>
  <ellipse cx="316" cy="290" rx="7" ry="4" fill="#6e8a5e" transform="rotate(-24 316 290)"/>
  <ellipse cx="330" cy="292" rx="7" ry="4" fill="#6e8a5e" transform="rotate(24 330 292)"/>
  <path d="M366 318 L384 312 L378 326 Z" fill="#a35c42"/>
</g>
<g transform="translate(60 322)">
  <circle r="12" fill="#4d6b45"/><circle cx="16" cy="4" r="9" fill="#6e8a5e"/><circle cx="-15" cy="6" r="8" fill="#6e8a5e"/>
</g>
${grassTuft(240, 358, '#4d6b45')}${grassTuft(440, 356, '#4d6b45')}${grassTuft(60, 356, '#4d6b45')}
<g transform="translate(430 130)"><ellipse rx="4" ry="3.2" fill="#c0392b"/><circle cx="-2.5" cy="-2" r="1.2" fill="#33302a"/><circle cx="2.5" cy="-1.5" r="1.2" fill="#33302a"/></g>`;

/* ---------------- 紙偶（底部 (0,0) 為立足點） ---------------- */

const CUT = 'stroke="#3a362e" stroke-opacity="0.35" stroke-width="1.5"';

const PUPPETS = {};

PUPPETS.mouse = `
<line x1="0" y1="0" x2="0" y2="30" stroke="#8a6b4a" stroke-width="4" stroke-linecap="round"/>
<circle cx="0" cy="34" r="6" fill="#c9a06a" ${CUT}/>
<path d="M-20 -10 C-36 -6 -44 6 -38 16 C-36 8 -30 2 -24 -2" fill="none" stroke="#9d9daa" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="0" cy="-20" rx="24" ry="17" fill="#a7a7b3" ${CUT}/>
<ellipse cx="-8" cy="-3" rx="7" ry="3.5" fill="#9797a5"/>
<ellipse cx="8" cy="-3" rx="7" ry="3.5" fill="#9797a5"/>
<circle cx="12" cy="-44" r="6" fill="#a7a7b3" ${CUT}/><circle cx="12" cy="-44" r="3" fill="#d8a0a8"/>
<circle cx="27" cy="-45" r="6" fill="#a7a7b3" ${CUT}/><circle cx="27" cy="-45" r="3" fill="#d8a0a8"/>
<circle cx="20" cy="-32" r="13" fill="#a7a7b3" ${CUT}/>
<circle cx="25" cy="-34" r="2" fill="#33302a"/>
<circle cx="33" cy="-31" r="2.5" fill="#d8a0a8"/>
<path d="M36 -30 L46 -27 M36 -32 L46 -34" stroke="#8a8474" stroke-width="1"/>`;

PUPPETS.snail = `
<line x1="0" y1="0" x2="0" y2="30" stroke="#8a6b4a" stroke-width="4" stroke-linecap="round"/>
<circle cx="0" cy="34" r="6" fill="#c9a06a" ${CUT}/>
<path d="M-28 -2 C-32 -12 -22 -18 -10 -18 L18 -16 C27 -15 29 -9 26 -2 Z" fill="#cdb96e" ${CUT}/>
<line x1="20" y1="-15" x2="26" y2="-28" stroke="#cdb96e" stroke-width="2.5" stroke-linecap="round"/>
<line x1="14" y1="-16" x2="16" y2="-27" stroke="#cdb96e" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="26" cy="-29" r="2.2" fill="#5c564a"/><circle cx="16" cy="-28" r="2" fill="#5c564a"/>
<circle cx="-7" cy="-26" r="17" fill="#a06a3c" ${CUT}/>
<path d="M-7 -26 a4 4 0 0 1 4 4 a8 8 0 0 1 -8 8 a12 12 0 0 1 -12 -12 a16 16 0 0 1 16 -16" fill="none" stroke="#7c4e2a" stroke-width="2.5"/>`;

PUPPETS.frog = `
<line x1="0" y1="0" x2="0" y2="30" stroke="#8a6b4a" stroke-width="4" stroke-linecap="round"/>
<circle cx="0" cy="34" r="6" fill="#c9a06a" ${CUT}/>
<ellipse cx="-20" cy="-6" rx="10" ry="6" fill="#6f9a52" ${CUT}/>
<ellipse cx="20" cy="-6" rx="10" ry="6" fill="#6f9a52" ${CUT}/>
<ellipse cx="0" cy="-18" rx="22" ry="16" fill="#7ba05b" ${CUT}/>
<ellipse cx="0" cy="-12" rx="13" ry="7" fill="#d9dfb0"/>
<circle cx="-9" cy="-32" r="6.5" fill="#7ba05b" ${CUT}/>
<circle cx="9" cy="-32" r="6.5" fill="#7ba05b" ${CUT}/>
<circle cx="-9" cy="-32" r="4" fill="#f6f1de"/><circle cx="9" cy="-32" r="4" fill="#f6f1de"/>
<circle cx="-9" cy="-32" r="1.8" fill="#33302a"/><circle cx="9" cy="-32" r="1.8" fill="#33302a"/>
<path d="M-6 -23 Q0 -19 6 -23" stroke="#4c6b3c" stroke-width="2" fill="none"/>
<circle cx="-14" cy="-21" r="2.5" fill="#d8a0a8" opacity="0.55"/>
<circle cx="14" cy="-21" r="2.5" fill="#d8a0a8" opacity="0.55"/>`;

PUPPETS.bird = `
<line x1="0" y1="0" x2="0" y2="30" stroke="#8a6b4a" stroke-width="4" stroke-linecap="round"/>
<circle cx="0" cy="34" r="6" fill="#c9a06a" ${CUT}/>
<path d="M-14 -16 L-34 -26 L-27 -17 L-36 -13 L-18 -8 Z" fill="#4d7c8c" ${CUT}/>
<ellipse cx="0" cy="-20" rx="18" ry="14" fill="#6b9aa8" ${CUT}/>
<ellipse cx="4" cy="-15" rx="9" ry="8" fill="#e8d9a8"/>
<path d="M-8 -24 C-16 -30 -8 -36 -2 -30 Z" fill="#4d7c8c" ${CUT}/>
<path d="M14 -26 L14 -36 L20 -29 Z" fill="#4d7c8c"/>
<path d="M14 -36 L14 -42 M10 -34 L8 -40" stroke="#e3b23c" stroke-width="3" stroke-linecap="round"/>
<path d="M15 -22 L28 -19 15 -16 Z" fill="#e3b23c" ${CUT}/>
<circle cx="11" cy="-27" r="2.2" fill="#33302a"/>`;

/* ---------------- 房源資料 ---------------- */

const SPOTS = [
  {
    id: 'stairs', no: 1, name: '邊坡長階梯', sub: '通往上層聚落的六十級台階',
    map: { x: 92, y: 236 },
    desc: '水泥階梯沿著山坡一路向上，青苔住在縫裡，扶手被幾十年的手掌摸得發亮。人類用來上下樓的地方，對小動物來說是一道垂直的長城。',
    baseTags: ['陡峭', '震動'],
    elements: [
      { obj: '階梯側緣的裂縫', facility: '防貓哨站', tags: ['隱蔽', '平坦'], note: '縫裡剛好塞下一隻老鼠的體寬，貓爪伸不進來。' },
      { obj: '扶手頂端', facility: '360°瞭望台', tags: ['高處', '視野', '易被發現'], note: '視野絕佳，但完全沒有遮蔽。' },
      { obj: '階梯下方的陰影', facility: '天然遮陽棚', tags: ['陰涼', '隱蔽'], note: '下午三點後，這裡是整條階梯最涼的地方。' }
    ]
  },
  {
    id: 'pipes', no: 2, name: '水管牆', sub: '後巷那面爬滿水管的牆',
    map: { x: 172, y: 192 },
    desc: '三條水管沿著牆面橫走：一條通往屋頂、一條不知通往哪裡、一條已經退休。管壁上凝著水珠，牆角長出一株沒人種的姑婆芋。',
    baseTags: ['安靜'],
    elements: [
      { obj: '退休水管內部', facility: '隔音隧道套房', tags: ['隱蔽', '平坦', '安靜'], note: '乾燥、溫暖、無風，巷子的聲音進不來。' },
      { obj: '管壁凝水', facility: '天然加濕器', tags: ['潮濕', '陰涼'], note: '全牆最濕的一條線，全年無休。' },
      { obj: '管口', facility: '景觀陽台', tags: ['視野', '易被發現'], note: '看得見整條後巷——但也會被整條後巷看見。' }
    ]
  },
  {
    id: 'roots', no: 3, name: '山壁樹根洞', sub: '老榕根與岩壁圍出的洞穴',
    map: { x: 252, y: 156 },
    desc: '一棵老榕樹把根扎進山壁，根與岩之間圍出一個安靜的洞。洞裡鋪著落葉，壁面滲著細水，小聲說話會有回音。',
    baseTags: ['陰涼', '安靜'],
    elements: [
      { obj: '樹根拱頂', facility: 'Living 根系天花板', tags: ['隱蔽', '植物'], note: '會呼吸、會生長的天花板，颱風天請相信它。' },
      { obj: '壁面滲水', facility: '山泉 SPA 牆', tags: ['潮濕'], note: '全年無休的天然保濕系統。' },
      { obj: '落葉地毯', facility: '防滑軟墊地板', tags: ['平坦', '植物'], note: '每年秋冬自動換新，免清潔費。' },
      { obj: '樹冠層', facility: '高樓層景觀戶', tags: ['高處', '視野', '曝曬'], note: '六樓的視野、六樓的風、六樓的太陽。' }
    ]
  },
  {
    id: 'roof', no: 4, name: '屋頂天線區', sub: '全村最高點，曬棉被的地方',
    map: { x: 322, y: 78 },
    desc: '沿著幾乎垂直的鐵梯爬上屋頂，天線歪歪地站著，曬衣繩在風裡晃。從這裡往下看，整個寶藏巖都是屋頂，再遠一點是新店溪。',
    baseTags: ['高處', '視野', '曝曬'],
    elements: [
      { obj: '天線桿頂', facility: '全聚落最高景觀塔', tags: ['高處', '視野', '易被發現'], note: '站上來，溪流與城市盡收眼底。' },
      { obj: '屋簷陰影', facility: '西曬防護簷', tags: ['陰涼', '隱蔽'], note: '屋頂上唯一的陰影，先搶先贏。' },
      { obj: '曬衣繩', facility: '空中盪鞦韆', tags: ['震動'], note: '風大的時候，這裡是全村最刺激的遊樂場。' }
    ]
  },
  {
    id: 'ditch', no: 5, name: '排水溝苔蘚地', sub: '永遠濕潤的陰暗水路',
    map: { x: 398, y: 232 },
    desc: '一條淺淺的排水溝繞著聚落邊緣，溝底鋪著軟黏的泥，兩側長滿苔蘚。人類嫌它陰暗，某些住民卻覺得這裡是豪宅區。',
    baseTags: ['潮濕', '陰涼', '平坦'],
    elements: [
      { obj: '溝底軟泥床', facility: '恆濕水床', tags: ['潮濕', '平坦', '安靜'], note: '含水量全年穩定，躺下去就不想起來。' },
      { obj: '苔蘚地毯', facility: '植絨綠地毯', tags: ['植物', '潮濕'], note: '踩起來像雲，躺起來像家。' },
      { obj: '溝緣曬石', facility: '觀星露天平台', tags: ['曝曬', '易被發現'], note: '白天是石頭，晚上是包廂。' }
    ]
  },
  {
    id: 'pots', no: 6, name: '廢花盆藤蔓區', sub: '被遺忘的盆栽樂園',
    map: { x: 300, y: 258 },
    desc: '角落堆著幾個裂開的舊花盆，藤蔓從盆裡爬出來，纏上半倒的竹棚架。這裡安靜到可以聽見藤蔓生長的聲音。',
    baseTags: ['植物', '安靜'],
    elements: [
      { obj: '花盆裂縫', facility: '陶土獨棟小屋', tags: ['隱蔽', '平坦'], note: '冬暖夏涼，裂縫即是門。' },
      { obj: '藤蔓簾幕', facility: '垂簾綠遮陽', tags: ['隱蔽', '植物', '陰涼'], note: '會隨季節變換造型的窗簾。' },
      { obj: '盆底積水', facility: '私人小水池', tags: ['潮濕'], note: '雨後自動補水，附贈蚊仔鄰居（可溝通）。' }
    ]
  }
];

const LIGHTS = [
  { id: 'morning', label: '晨光' },
  { id: 'noon', label: '午後' },
  { id: 'dusk', label: '暮色' },
  { id: 'torch', label: '手電筒' }
];
