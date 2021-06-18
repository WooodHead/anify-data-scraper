const scrapAnimePage = async (
  ayakashi: import("@ayakashi/types").IAyakashiInstance,
  { url, index }: { url: string; index: number }
) => {
  await ayakashi.goTo(url);

  // get anime title
  ayakashi
    .selectOne("titleContainer")
    .where({ class: { like: "title-name" } })
    .selectFirstChild("title");
  const title = (await ayakashi.extractFirst("title")) || "";

  return { [index]: { title } };
};

module.exports = scrapAnimePage;
