const db = require('./src/db.js')
const debug = require('debug')('airbnb_scraper')
const propertyDataService = require('./src/propertyDataService.js')
const cron = require('node-cron')

const cronJob = cron.schedule('30 5 * * *', () => {
  initialize()
    .then(() => {
      return propertyDataService.create()
    })
    .then(() => {
      db.close()
    })
    .catch((err) => {
      debug('There was an error: ', err)
      throw new Error(err)
    })
}, null, true, 'America/Chicago')

debug('Starting cron')
cronJob.start()

/* INIT */

function initialize () {
  return new Promise((resolve, reject) => {
    db.connect()
    .then(() => {
      debug('Success connecting')
      debug('Creating property collection')
      resolve(db.createPropertyCollection())
    })
    .catch((err) => {
      debug('There was an error' + err)
      reject(err)
    })
  })
}
