import xml2js from "xml2js";
import got from "got";

const getScrapURLs = async () => {
  console.log("🟡 [IN PROGRESS] - Generating all Possible Animes");

  const fourtyK = Array.from(Array(40000)).map((_, idx) => idx + 1);

  const ids = fourtyK.map((entry, index) => {
    return {
      id: entry,
      index,
      total: fourtyK.length,
    };
  });

  console.log(
    "🟢 [SUCCESS] - Ids generated - Number of URLs to scrap:",
    ids.length
  );

  return ids;
};

module.exports = getScrapURLs;
