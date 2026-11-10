import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';

const root = '/home/user/workspace/yan-lai-ru-ci';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
const server = http.createServer((req, res) => {
  let p = req.url.split('?')[0];
  if (p === '/') p = '/index.html';
  const f = root + p;
  try {
    const d = fs.readFileSync(f);
    res.writeHead(200, { 'Content-Type': types[p.slice(p.lastIndexOf('.'))] || 'text/plain' });
    res.end(d);
  } catch { res.writeHead(404); res.end('nf'); }
});
await new Promise(r => server.listen(8899, r));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(String(e)));

await page.goto('http://localhost:8899/');
await page.waitForTimeout(1200);
await page.screenshot({ path: root + '/qa/01-title.png' });

// 開始任務
await page.click('#startBtn');
await page.waitForTimeout(400);
// 抽卡：點第一張委託卡
await page.click('.tcard');
await page.waitForTimeout(900);
await page.screenshot({ path: root + '/qa/02-draw.png' });

// 接受委託（若抽到可重抽，直接接受）
await page.click('#acceptBtn');
await page.waitForTimeout(400);
await page.screenshot({ path: root + '/qa/03-map.png' });

// 勘查 3 處：依序點地圖標記 1,2,3，每次返回地圖
for (const no of [1, 2, 3]) {
  await page.click(`.marker[data-spot] >> nth=${no - 1}`);
  await page.waitForTimeout(300);
  if (no === 1) await page.screenshot({ path: root + '/qa/04-detail.png' });
  await page.click('#backMap');
  await page.waitForTimeout(200);
}
// 決定在第 2 處刊登（水管牆）
await page.click('.marker[data-spot] >> nth=1');
await page.waitForTimeout(300);
await page.click('#pickSpot');
await page.waitForTimeout(400);
await page.screenshot({ path: root + '/qa/05-facilities.png' });

// 選 2 項設施
await page.click('.fac-card >> nth=0');
await page.waitForTimeout(150);
await page.click('.fac-card >> nth=1');
await page.waitForTimeout(300);
await page.screenshot({ path: root + '/qa/06-fac-sel.png' });

// 前往攝影
await page.click('#toPhoto');
await page.waitForTimeout(500);
await page.screenshot({ path: root + '/qa/07-photo.png' });

// 拖曳紙偶 + 換光線
const frame = await page.locator('#photoFrame').boundingBox();
await page.mouse.move(frame.x + 300, frame.y + 150);
await page.mouse.down();
await page.mouse.move(frame.x + 160, frame.y + 210, { steps: 8 });
await page.mouse.up();
await page.click('#lightSeg button[data-light="torch"]');
await page.waitForTimeout(300);
await page.screenshot({ path: root + '/qa/08-photo-torch.png' });

// 按快門
await page.click('#shutterBtn');
await page.waitForTimeout(900);
await page.screenshot({ path: root + '/qa/09-captured.png' });

// 就用這張
await page.click('#usePhotoBtn');
await page.waitForTimeout(600);
await page.screenshot({ path: root + '/qa/10-ad.png' });

// 下載廣告（觸發 canvas 路徑）
await page.click('#dlBtn');
await page.waitForTimeout(1500);

// 遞出廣告
await page.click('#sendAd');
await page.waitForTimeout(600);
await page.screenshot({ path: root + '/qa/11-reveal.png' });

// 再接一筆委託 → 回到抽卡
await page.click('#againBtn');
await page.waitForTimeout(400);
await page.screenshot({ path: root + '/qa/12-again.png' });

// 手機版截圖（重新跑一次精簡流程）
const mp = await browser.newPage({ viewport: { width: 375, height: 760 } });
mp.on('pageerror', e => errors.push('MOBILE: ' + String(e)));
await mp.goto('http://localhost:8899/');
await mp.waitForTimeout(1000);
await mp.screenshot({ path: root + '/qa/m1-title.png' });
await mp.click('#startBtn');
await mp.waitForTimeout(300);
await mp.click('.tcard');
await mp.waitForTimeout(800);
await mp.click('#acceptBtn');
await mp.waitForTimeout(400);
await mp.screenshot({ path: root + '/qa/m2-map.png' });
await mp.click('.marker[data-spot] >> nth=0');
await mp.waitForTimeout(300);
await mp.screenshot({ path: root + '/qa/m3-detail.png' });

console.log('ERRORS:', JSON.stringify(errors, null, 2));
await browser.close();
server.close();
