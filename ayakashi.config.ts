// this config will scrap all anime pages from mal with throttle prevention
const fullRun: import("@ayakashi/types").Config = {
  config: {
    workers: 1,
  },
  waterfall: [
    {
      type: "script",
      module: "getScrapURLs",
      config: {
        retries: 2,
      },
    },
    {
      type: "scraper",
      module: "webScraper",
      config: {
        retries: 15,
        pipeConsole: false,
      },
    },
    {
      type: "script",
      module: "sendToLambda",
      config: {
        retries: 2,
      },
    },
  ],
};

// this config will hit a single anime page from mal without throttle prevention
const singleRun: import("@ayakashi/types").Config = {
  config: {
    workers: 1,
  },
  waterfall: [
    {
      type: "scraper",
      module: "webScraper",
      params: {
        url: "https://myanimelist.net/anime/21/One_Piece",
      },
      config: {
        pipeConsole: false,
      },
    },
    {
      type: "script",
      module: "printToConsole",
    },
  ],
};

// this config will scrap all jikan api with 50k ids
const fullRunApi: import("@ayakashi/types").Config = {
  config: {
    workers: 3,
  },
  waterfall: [
    {
      type: "script",
      module: "getIds",
      config: {
        retries: 2,
      },
    },
    {
      type: "scraper",
      module: "apiScraper",
      config: {
        retries: 15,
        pipeConsole: false,
      },
    },
    {
      type: "script",
      module: "sendToLambda",
      config: {
        retries: 2,
      },
    },
  ],
};

// set the current config here
module.exports = fullRunApi;
