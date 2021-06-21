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
      module: "scrapAnimePage",
      config: {
        retries: 2,
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
      module: "scrapAnimePage",
      params: {
        url: "https://myanimelist.net/anime/21/One_Piece",
      },
      config: {
        pipeConsole: false,
      },
    },
    {
      type: "script",
      module: "sendToLambda",
    },
  ],
};

// set the current config here
module.exports = fullRun;
