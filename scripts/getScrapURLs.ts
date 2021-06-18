import xml2js from "xml2js";
import got from "got";

const getScrapURLs = async (
  ayakashi: import("@ayakashi/types").IAyakashiInstance
) => {
  const xml = await got.get("https://myanimelist.net/sitemap/anime-000.xml");

  // convert xml to json
  const siteMap: SiteMap = await xml2js.parseStringPromise(xml.body);

  // extract the URLs
  const urls = siteMap.urlset.url.map((entry) => entry.loc[0]);

  console.log("urls.length", urls.length);

  return urls;
};

module.exports = getScrapURLs;
