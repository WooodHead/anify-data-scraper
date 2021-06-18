import { createHash } from "crypto";

const scrapAnimePage = async (
  ayakashi: import("@ayakashi/types").IAyakashiInstance,
  url: string
) => {
  // wait x ms between runs to prevent throttling
  await ayakashi.wait(5000);

  await ayakashi.goTo(url);

  // get anime title
  ayakashi
    .selectOne("titleContainer")
    .where({ class: { like: "title-name" } })
    .selectFirstChild("title");
  const title = (await ayakashi.extractFirst("title")) || "";

  // generate a unique ID using the hash of the title
  const id = createHash("sha1");
  id.update(title);

  return { id, title };
};

module.exports = scrapAnimePage;
