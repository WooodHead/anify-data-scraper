import { createHash } from "crypto";

const scrapAnimePage = async (
  ayakashi: import("@ayakashi/types").IAyakashiInstance,
  input?: string,
  params?: { url?: string; disableThrottling?: boolean }
) => {
  // use the params.url override if exists, otherwise use the input url
  const url = params?.url || input;

  if (!url) throw new Error("No URL provided");

  // wait x ms between runs to prevent throttling (if enabled)
  if (!params?.disableThrottling) await ayakashi.wait(5000);

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

  return { id: hash.digest("hex"), title };
};

module.exports = scrapAnimePage;
