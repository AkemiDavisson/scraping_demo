const MongoClient = require('mongodb').MongoClient
const debug = require('debug')('airbnb_scraper')
var state = { client: null, db: null }

module.exports = {
  connect: connect,
  get: get,
  close: close,
  createPropertyCollection: createPropertyCollection
}

function connect () {
  if (state.db) { return Promise.resolve() }
  debug('Connecting to server')
  return MongoClient.connect('mongodb://localhost:27017')
    .then((client) => {
      state.client = client
      state.db = client.db('development')
    })
    .catch((err) => {
      console.log('ERR', err)
    })
}

function get () {
  return state.db
}

function close () {
  if (state.client) {
    return state.client.close()
      .then(() => {
        state.client = null
        state.db = null
        state.mode = null
        debug('Connection Closed')
      })
      .catch((err) => {
        return err
      })
  }
}

function createPropertyCollection () {
  if (state.db) {
    // console.log('STATE.DB?', state.db)
    state.db.createCollection('property_listings', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: [ 'property_id', 'name', 'rank' ],
          property_listings: {
            property_id: {
              bsonType: 'int',
              description: 'property_id is required'
            },
            name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            rank: {
              bsonType: 'int',
              description: 'rank is required'
            },
            superhost: {
              bsonType: 'bool'
            },
            created_at: {
              bsonType: 'date'
            }
          }
        }
      }
    })
  }
}
