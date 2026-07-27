const {chromium} = require('playwright');
const path = require('path');
const fs = require('fs');

const videos = [
  '/Users/_ted/Downloads/ABDM/Videos/From Klickpin.com- 12 Creative cozy apartment decor ideas that help you create a polished look with very simple and affordable details for busy pe.mp4',
  '/Users/_ted/Downloads/ABDM/Videos/From Klickpin.com- Save these elegant digital planning tips that turn ordinary ideas into scroll-stopping inspiration for a polished look that sti.mp4'
];

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required']
  });
  const page = await browser.newPage({viewport: {width: 1000, height: 1000}, deviceScaleFactor: 1});
  const report = [];

  for (let videoIndex = 0; videoIndex < videos.length; videoIndex++) {
    const source = `file://${videos[videoIndex].split('/').map(encodeURIComponent).join('/').replace('file%3A%2F%2F','')}`;
    await page.goto(source, {waitUntil: 'load'});
    await page.addStyleTag({content: 'html,body{margin:0;background:#050505;display:grid;place-items:center;height:100%}video{max-width:100vw;max-height:100vh}'});
    const video = page.locator('video');
    await video.evaluate(element => new Promise((resolve, reject) => {
      if (element.readyState >= 1) return resolve();
      element.addEventListener('loadedmetadata', resolve, {once: true});
      element.addEventListener('error', () => reject(element.error?.message || 'video error'), {once: true});
    }));
    const metadata = await video.evaluate(element => ({duration: element.duration, width: element.videoWidth, height: element.videoHeight}));
    report.push({file: videos[videoIndex], ...metadata});
    await page.setViewportSize({width: metadata.width, height: metadata.height});
    for (let sample = 0; sample < 6; sample++) {
      const time = Math.min(metadata.duration - 0.04, metadata.duration * (sample / 5));
      await video.evaluate((element, target) => new Promise(resolve => {
        if (Math.abs(element.currentTime - target) < 0.02) return resolve();
        element.addEventListener('seeked', resolve, {once: true});
        element.currentTime = Math.max(0, target);
      }), time);
      await video.screenshot({path: path.join(__dirname, `video-ref-${videoIndex + 1}-${sample + 1}.png`)});
    }
  }
  fs.writeFileSync(path.join(__dirname, 'video-reference-analysis.json'), JSON.stringify(report, null, 2));
  await browser.close();
  console.log(JSON.stringify(report, null, 2));
})().catch(error => {console.error(error);process.exit(1);});
