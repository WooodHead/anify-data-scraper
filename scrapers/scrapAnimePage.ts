import { createHash } from "crypto";
import determineStatus from "../utils/determineStatus";
import determineType from "../utils/determineType";

const scrapAnimePage = async (
  ayakashi: import("@ayakashi/types").IAyakashiInstance,
  input?: string,
  params?: { url?: string; disableThrottling?: boolean }
) => {
  // use the params.url override if exists, otherwise use the input url
  const url = params?.url || input;

  if (!url) throw new Error("No URL provided");

  // wait x ms between runs to prevent throttling (if enabled)
  if (!params?.disableThrottling) await ayakashi.wait(0);

  await ayakashi.goTo(url);

  // get anime title
  ayakashi
    .selectOne("titleContainer")
    .where({ class: { like: "title-name" } })
    .selectFirstChild("title");
  const title = (await ayakashi.extractFirst("title")) || undefined;

  // this determines our primary key, so just throw an error if it doesn't exist!
  if (!title) throw new Error("No title exists!");

  // get anime type
  ayakashi.select("type").where({
    innerText: {
      like: /^Type: [a-zA-Z]+$/,
    },
  });
  const type = determineType(
    (await ayakashi.extractFirst("type"))?.replace("Type: ", "") || ""
  );

  // get number of episodes
  ayakashi.select("episodes").where({
    innerText: {
      like: /^Episodes: [0-9]+$/,
    },
  });
  const episodes =
    (await ayakashi.extractFirst("episodes"))?.replace("Episodes: ", "") ||
    undefined;

  // get status
  ayakashi.select("status").where({
    innerText: {
      like: /^Status: [\\s\\S]+$/,
    },
  });
  const status = determineStatus(
    (await ayakashi.extractFirst("status"))?.replace("Status: ", "") || ""
  );

  // get main image
  ayakashi.select("mainImage").where({
    and: [
      {
        tagName: {
          eq: "img",
        },
      },
      {
        src: {
          like: "/anime/",
        },
      },
    ],
  });
  const mainImage =
    (await ayakashi.extractFirst("mainImage", "src")) || undefined;

  // get rating
  ayakashi.select("rating").where({
    innerText: {
      like: /^Rating: [\\s\\S]+$/,
    },
  });
  const rating =
    (await ayakashi.extractFirst("rating"))?.replace("Rating: ", "") ||
    undefined;

  // get genres
  ayakashi.select("genres").where({
    href: {
      like: "/anime/genre/",
    },
  });
  const genres = (await ayakashi.extract("genres")) || [];

  // get premiered season and year
  ayakashi.select("premiered").where({
    innerText: {
      like: /^Premiered: [\\s\\S]+$/,
    },
  });
  const premiered =
    (await ayakashi.extractFirst("premiered"))?.replace("Premiered: ", "") ||
    "";
  const premieredSeason = premiered.match(/[a-zA-Z]+/)?.[0];
  const premieredYear = premiered.match(/[0-9]+/)?.[0];

  // get aired dates
  ayakashi.select("aired").where({
    innerText: {
      like: /^Aired: [\\s\\S]+$/,
    },
  });
  const rawAired = (await ayakashi.extractFirst("aired"))?.replace(
    "Aired: ",
    ""
  );
  const seperatedAired = rawAired?.split(" to ") || undefined;
  const airedStart = seperatedAired?.[0]
    ? new Date(seperatedAired[0]).toISOString()
    : undefined;
  const airedEnd = seperatedAired?.[1]
    ? new Date(seperatedAired[1]).toISOString()
    : undefined;

  // generate a unique ID using the hash of the title
  const hash = createHash("sha1");
  hash.update(title || "");

  return {
    id: hash.digest("hex"),
    title,
    type,
    episodes,
    status,
    mainImage,
    rating,
    genres,
    premieredSeason,
    premieredYear,
    airedStart,
    airedEnd,
  };
};

module.exports = scrapAnimePage;
