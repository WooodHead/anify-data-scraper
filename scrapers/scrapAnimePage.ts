import { createHash } from "crypto";

const scrapAnimePage = async (
  ayakashi: import("@ayakashi/types").IAyakashiInstance,
  url: string
) => {
  await ayakashi.goTo(url);

  // get anime title
  ayakashi
    .selectOne("titleContainer")
    .where({ class: { like: "title-name" } })
    .selectFirstChild("title");
  const title = (await ayakashi.extractFirst("title")) || "";

  // generate a unique ID using the hash of the title
  const hash = createHash("sha1");
  hash.update(title);

  return { [hash.digest("hex")]: { title } };
};

module.exports = scrapAnimePage;
