const casper = require('casper').create({verbose : true})
const fs = require('fs')
var data = { properties: [] }
var nextPage = 'ul[data-id="SearchResultsPagination"] > li:last-child > a'

casper.on('remote.message', function (msg) {
  console.log(msg)
})

casper.start('https://www.airbnb.com/s/Austin--TX--United-States/homes?refinements%5B%5D=homes&in_see_all=true&allow_override%5B%5D=&s_tag=QkGJ9fp6')
  .wait(2000, processPage)
  .run()

function processPage () {
  var arr = this.evaluate(getData)

  if (arr !== 'stopScript') {
    data.properties = data.properties.concat(arr)
    casper.echo('Property count: ' + data.properties.length, 'INFO')
    casper.waitUntilVisible(nextPage, function () {
      this.thenClick(nextPage).then(function () {
        this.wait(2000, processPage)
      })
    }, 10000)
  } else {
    stopScript()
  }
}

function stopScript () {
  fs.write('/Users/Akemi/Documents/scraping_demo/output/properties.json', JSON.stringify(data, null, '\t'))
  casper.echo('STOPPING SCRIPT').exit()
}

function getData () {
  // select properties
  var listItemsArr = Array.from(document.querySelectorAll('div[itemprop="itemListElement"]'))
  // setup pagination offset
  var numberPerPage = listItemsArr.length
  var pageRegex = /offset=(\d+)/g
  var currentOffset = pageRegex.exec(document.URL)
  var start = ((currentOffset ? currentOffset[1] : 0) * numberPerPage)

  // check if last page
  var nextPageLink = document.querySelector('ul[data-id="SearchResultsPagination"] > li:last-child > a')
  if (document.URL === nextPageLink.href) {
    return 'stopScript'
  };

  // return map of property data
  return listItemsArr.map(function (item) {
    var idString = item.querySelector('div:first-child').getAttribute('id')
    const idRegex = /\d+/g
    var id = parseInt(idRegex.exec(idString)[0], 10)
    var propertyTitle = item.querySelector('meta[itemProp="name"]').getAttribute('content')
    var propertyRank = start + parseInt(item.querySelector('meta[itemProp="position"]').getAttribute('content'), 10)
    var superhost = Array.from(item.querySelectorAll('span')).find(function (el) { return el.textContent === 'Superhost' })
    var date = new Date()

    return {
      property_id: id,
      name: propertyTitle,
      rank: propertyRank,
      superhost: superhost ? true : false,
      created_at: date
    }
  })
}
