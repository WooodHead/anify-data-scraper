const config: import("@ayakashi/types").Config = {
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

module.exports = config;
