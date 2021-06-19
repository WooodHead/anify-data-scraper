import xml2js from "xml2js";
import got from "got";

const getScrapURLs = async () => {
  console.log("🟡 [IN PROGRESS] - Pulling sitemap data...");

  const xml = await got.get("https://myanimelist.net/sitemap/anime-000.xml");

  // convert xml to json
  const siteMap: SiteMap = await xml2js.parseStringPromise(xml.body);

  // extract the URLs
  const urls = siteMap.urlset.url.map((entry, index) => {
    return {
      url: entry.loc[0],
      index: index,
      total: siteMap.urlset.url.length,
    };
  });

  console.log(
    "🟢 [SUCCESS] - Sitemap data pulled - Number of URLs to scrap:",
    urls.length
  );

  return urls;
};

module.exports = getScrapURLs;
