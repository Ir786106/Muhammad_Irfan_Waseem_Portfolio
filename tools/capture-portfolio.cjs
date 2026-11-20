const {chromium} = require('playwright');
const fs = require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1280,height:800},colorScheme:'dark',reducedMotion:'reduce'});
  await page.route('https://**/*',route=>route.abort());
  await page.goto('http://127.0.0.1:8080/');
  await page.locator('.proj-card').first().waitFor();
  const cdp=await page.context().newCDPSession(page);
  async function capture(name){const shot=await cdp.send('Page.captureScreenshot',{format:'webp',quality:82});fs.writeFileSync('Images/projects/'+name+'.webp',Buffer.from(shot.data,'base64'));}
  await capture('portfolio-home');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await capture('portfolio-projects');
  await page.setViewportSize({width:390,height:844});
  await page.locator('#theme-toggle').click();
  await page.evaluate(()=>scrollTo(0,0));
  await capture('portfolio-mobile');
 } finally {await browser.close();}
})();
