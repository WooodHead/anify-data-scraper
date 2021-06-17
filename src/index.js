module.exports = async function (ayakashi) {
  //go to the page
  await ayakashi.goTo("https://github.com/ayakashi-io/ayakashi");

  //find and extract the about message
  ayakashi.selectOne("about").where({ itemprop: { eq: "about" } });
  const about = await ayakashi.extractFirst("about", "text");

  //find and extract star count
  ayakashi.selectOne("stars").where({ href: { like: "/stargazers" } });
  const stars = await ayakashi.extractFirst("stars", "number");

  //find the green button that opens the clone dialog
  ayakashi.selectOne("cloneDialogTrigger").where({
    and: [
      {
        class: {
          eq: "btn",
        },
      },
      {
        "style-background-color": {
          eq: "rgb(40, 167, 69)",
        },
      },
      {
        textContent: {
          like: "Clone",
        },
      },
    ],
  });
  //click it
  await ayakashi.click("cloneDialogTrigger");

  //find and extract the clone url
  ayakashi
    .selectOne("cloneUrl")
    .where({ "aria-label": { like: "Clone this repository at" } });
  const cloneUrl = await ayakashi.extractFirst("cloneUrl", "value");

  //return our results
  return { about, stars, cloneUrl };
};
