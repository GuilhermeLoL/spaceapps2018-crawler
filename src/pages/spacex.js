const puppeteer =  require('puppeteer')
const link = 'https://www.spacex.com/missions'
const selector = 'div.view-content > table.views-table > tbody > tr'

async function getData () {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto(link, { waitUntil: ['domcontentloaded', 'load'] })
  page.setViewport({ width: 1280, height: 926 })
  await page.waitForSelector(selector)
  let data = await page.evaluate((selector) => {
    let itemList = []
    let itemTitle = Array.from(document.querySelectorAll(`${selector} > .customer > span`))
    let itemDate = Array.from(document.querySelectorAll(`${selector} > .mission-year > span`))
    let itemLaunch = Array.from(document.querySelectorAll(`${selector} > .launch-site > span`))
    let itemVehicle = Array.from(document.querySelectorAll(`${selector} > .vehicle > span > div:nth-child(1) > h2 > a`))
    for (let x = 0; x < itemTitle.length; x++) {
      let date = ''
      let scheduled = false
      if (itemDate[x] !== undefined) {
        let dateArray = itemDate[x].innerText.split('/')
        date = `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`
        scheduled = true
      }
      let launch = itemLaunch[x].innerText
      let vehicle = itemVehicle[x] !== undefined ? itemVehicle[x].textContent : 'Falcon 1'
      itemList.push({
        title: itemTitle[x].innerText,
        link: itemVehicle[x] !== undefined ? itemVehicle[x].href : '',
        description: `${vehicle} launched from ${launch}`,
        date,
        scheduled,
        origin: 'SPACEX'
      })
    }
    return itemList
  }, selector)
  await browser.close()
  return data
}
module.exports = getData
