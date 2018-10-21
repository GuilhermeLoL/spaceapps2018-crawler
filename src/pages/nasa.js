const puppeteer =  require('puppeteer')
const link = 'https://www.nasa.gov/launchschedule/'
const selector = '.launch-schedule > .launch-event'

async function getData () {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto(link, { waitUntil: ['domcontentloaded', 'load'], timeout: 60000 })
  page.setViewport({ width: 1280, height: 926 })
  await page.waitForSelector(selector)
  await page.waitFor(3000)
  let data = await page.evaluate((selector) => {
    let itemList = []
    let itemTitle = Array.from(document.querySelectorAll(`${selector} > .launch-info > .title > a`))
    let itemDesc = Array.from(document.querySelectorAll(`${selector} > .launch-info > .description`))
    let itemDate = Array.from(document.querySelectorAll(`${selector} > .launch-info > div > .date`))
    for (let x = 0; x < itemTitle.length; x++) {
      let scheduled = false
      let dateString = itemDate[x].innerText.split('Date: ')[1]
      if (dateString.includes('Launch Window: ')) {
        dateString = dateString.split('\nLaunch Window: ')[0]
      }
      if (dateString.includes(' - ')) {
        dateString = dateString.split(' - ')[0]
      }
      if (dateString.includes(', ')) {
        let msec = Date.parse(dateString)
        let date = new Date(msec)
        let day = date.getDate() + 1
        day = '0' + day
        day = day.slice(-2)
        let month = date.getMonth() + 1
        month = '0' + month
        month = month.slice(-2)
        dateString = `${date.getFullYear()}-${month}-${day}`
        scheduled = true
      } else {
        dateString = ''
      }
      itemList.push({
        title: itemTitle[x].textContent,
        link: itemTitle[x].href,
        description: itemDesc[x].innerText.split('Description: ')[1],
        date: dateString,
        scheduled,
        origin: 'NASA'
      })
    }
    return itemList
  }, selector)
  await browser.close()
  return data
}
module.exports = getData
