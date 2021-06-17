module.exports = async function (
  ayakashi: import("@ayakashi/types").IAyakashiInstance
) {
  // go to the page
  await ayakashi.goTo("https://myanimelist.net/anime/1");

  // get anime title
  ayakashi
    .selectOne("titleContainer")
    .where({ class: { like: "title-name" } })
    .selectFirstChild("title");
  const title = await ayakashi.extractFirst("title");

  return { title };
};
