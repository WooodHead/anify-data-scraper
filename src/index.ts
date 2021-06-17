import xml2js from "xml2js";

module.exports = async function (
  ayakashi: import("@ayakashi/types").IAyakashiInstance
) {
  const xml = await ayakashi.get(
    "https://myanimelist.net/sitemap/anime-000.xml"
  );

  // convert xml to json
  const result: { urlset: { url: Array<{ loc: string[] }> } } =
    await xml2js.parseStringPromise(xml);

  // extract the URLs
  const urls = result.urlset.url.map((entry) => entry.loc[0]);

  for (let i = 0; i < 3; i++) {
    // go to the page
    await ayakashi.goTo(urls[i]);

    // get anime title
    ayakashi
      .selectOne("titleContainer")
      .where({ class: { like: "title-name" } })
      .selectFirstChild("title");
    const title = (await ayakashi.extractFirst("title")) || "";

    ayakashi.yield({ [title]: "test" });
  }
};
