const db = require('./db')
const propertyData = require('../output/properties.json')

module.exports = {
  create: create
}

function create () {
  var collection = db.get().collection('property_listings')

  return collection.insertMany(propertyData.properties, {forceServerObjectId: true})
}
