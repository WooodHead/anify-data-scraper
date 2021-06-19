// this config will scrap all anime pages from mal with throttle prevention
const fullRun: import("@ayakashi/types").Config = {
  config: {
    workers: 1,
  },
  waterfall: [
    {
      type: "script",
      module: "getScrapURLs",
    },
    {
      type: "scraper",
      module: "scrapAnimePage",
    },
    {
      type: "script",
      module: "printToConsole",
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
        url: "https://myanimelist.net/anime/5114/Fullmetal_Alchemist__Brotherhood",
        disableThrottling: true,
      },
    },
    {
      type: "script",
      module: "printToConsole",
    },
  ],
};

// set the current config here
module.exports = singleRun;
