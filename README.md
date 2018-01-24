
#### Setup:

```
npm install
```

#### To schedule webScrapingUtil:

```
crontab -e

0 5 * * * PHANTOM_JS_EXECUTABLE=/PATH/TO/phantomjs /PATH/TO/casperjs  /PATH/TO/scraping_demo/webScrapingUtil.js
```

This will run every day at 5AM


#### To schedule mongodb insert:

```
  //optional DEBUG=airbnb_scraper for logs
  npm start
```

This will run every day at 5:30AM


#### To run the webScrapingUtil manually run:

```
npm run scrape
```
