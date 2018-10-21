const axios = require('axios')
const nasa = require('./pages/nasa')
const spacex = require('./pages/spacex')
const asyncForEach = require('./utils/asyncForeach')

;(async () => {
  let data = []
  data.push(await spacex())
  data.push(await nasa())
  asyncForEach(data, async e => {
    asyncForEach(e, async e => {
      axios.post('http://localhost:3000/launches', e)
        .catch(() => console.log(e))
    })
  })
})()
