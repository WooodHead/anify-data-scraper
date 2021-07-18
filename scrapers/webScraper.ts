import determineStatus from "../utils/determineStatus";
import determineType from "../utils/determineType";

const webScraper = async (
  ayakashi: import("@ayakashi/types").IAyakashiInstance,
  input?: { url: string; index: number; total: number },
  params?: { url?: string }
) => {
  // seperator between runs
  console.log("\n_____________________________________________________\n");

  // use the params.url override if exists, otherwise use the input url
  const url = params?.url || input?.url;

  if (!url) throw new Error("No URL provided");

  // if full run
  if (!params?.url && input) {
    // wait x ms between runs to prevent throttling
    console.log(
      `🟣 [IDLE] - (${input.index + 1}/${
        input.total
      }) - Waiting to prevent throttle...`
    );
    await ayakashi.wait(10000 + Math.floor(Math.random() * 5000));

    // give status update
    console.log(
      `🟡 [IN PROGRESS] - (${input.index + 1}/${input.total}) - Scraping ${url}`
    );
  }

  await ayakashi.goTo(url);

  // check if 404 page
  const noPageFound = ayakashi
    .select("noPageFound")
    .where({ src: { like: "/error/404" } });
  if (await noPageFound.hasMatches()) {
    console.log(`🔴 [ERROR] - Page does not exist for ${url}`);
    return null;
  }

  // get genres
  ayakashi.select("genres").where({
    href: {
      like: "/anime/genre/",
    },
  });
  const genres = (await ayakashi.extract("genres")) || [];

  // no hentai for now
  if (genres.includes("Hentai")) {
    console.log(`🔵 [SKIPPED] - Hentai detected, skipping item...`);
    return null;
  }

  // get anime title
  ayakashi
    .selectOne("titleContainer")
    .where({ class: { like: "title-name" } })
    .selectFirstChild("title");
  const title = (await ayakashi.extractFirst("title")) || undefined;

  // this determines our primary key, so just throw an error if it doesn't exist!
  if (!title) throw new Error("No title exists!");

  // get description
  ayakashi.selectOne("description").where({ itemprop: { eq: "description" } });
  const description =
    // extract innerText instead so we can get the line breaks
    (await ayakashi.extractFirst("description", "innerText")) || undefined;

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

  // get season
  ayakashi.select("season").where({
    innerText: {
      like: /^Premiered: [\\s\\S]+$/,
    },
  });
  const premiered =
    (await ayakashi.extractFirst("season"))?.replace("Premiered: ", "") || "";
  const season = premiered.match(/[a-zA-Z]+/)?.[0];

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
  const airedStart =
    seperatedAired?.[0] &&
    seperatedAired?.[0] !== "Not available" &&
    seperatedAired?.[0].length > 3
      ? new Date(seperatedAired[0]).toISOString()
      : undefined;
  const airedEnd =
    seperatedAired?.[1] && seperatedAired?.[1].length > 3
      ? new Date(seperatedAired[1]).toISOString()
      : undefined;

  // get duration
  ayakashi.select("duration").where({
    innerText: {
      like: /^Duration: [\\s\\S]+$/,
    },
  });
  const duration =
    (await ayakashi.extractFirst("duration"))?.replace("Duration: ", "") ||
    undefined;

  // get producers
  ayakashi.select("producers").where({
    innerText: {
      like: /^Producers: [\\s\\S]+$/,
    },
  });
  const rawProducers = await ayakashi.extractFirst("producers");
  const splitProducers = rawProducers
    ? rawProducers
        .replace("Producers:", "")
        .split(", ")
        .map((item) => item.trim())
    : [];
  const producers = splitProducers[0] !== "None found" ? splitProducers : [];

  // get licensors
  ayakashi.select("licensors").where({
    innerText: {
      like: /^Licensors: [\\s\\S]+$/,
    },
  });
  const rawLicensors = await ayakashi.extractFirst("licensors");
  const splitLicensors = rawLicensors
    ? rawLicensors
        .replace("Licensors:", "")
        .split(", ")
        .map((item) => item.trim())
    : [];
  const licensors = splitLicensors[0] !== "None found" ? splitLicensors : [];

  // get studios
  ayakashi.select("studios").where({
    innerText: {
      like: /^Studios: [\\s\\S]+$/,
    },
  });
  const rawStudios = await ayakashi.extractFirst("studios");
  const splitStudios = rawStudios
    ? rawStudios
        .replace("Studios:", "")
        .split(", ")
        .map((item) => item.trim())
    : [];
  const studios = splitStudios[0] !== "None found" ? splitStudios : [];

  // get source
  ayakashi.select("sourceMaterialType").where({
    innerText: {
      like: /^Source: [\\s\\S]+$/,
    },
  });
  const sourceMaterialType =
    (await ayakashi.extractFirst("sourceMaterialType"))?.replace(
      "Source: ",
      ""
    ) || undefined;

  // get englishTitle
  ayakashi.select("englishTitle").where({
    innerText: {
      like: /^English: [\\s\\S]+$/,
    },
  });
  const englishTitle =
    (await ayakashi.extractFirst("englishTitle"))?.replace("English: ", "") ||
    undefined;

  // get japaneseTitle
  ayakashi.select("japaneseTitle").where({
    innerText: {
      like: /^Japanese: [\\s\\S]+$/,
    },
  });
  const japaneseTitle =
    (await ayakashi.extractFirst("japaneseTitle"))?.replace("Japanese: ", "") ||
    undefined;

  // get synonyms
  ayakashi.select("synonyms").where({
    innerText: {
      like: /^Synonyms: [\\s\\S]+$/,
    },
  });
  const rawSynonyms = await ayakashi.extractFirst("synonyms");
  const synonyms = rawSynonyms
    ? rawSynonyms
        .replace("Synonyms:", "")
        .split(", ")
        .map((item) => item.trim())
    : [];

  // get sources
  const sources = [{ name: "MyAnimeList", url }];

  // get score
  ayakashi.selectOne("score").where({ itemprop: { eq: "ratingValue" } });
  const score =
    // extract innerText instead so we can get the line breaks
    Number(await ayakashi.extractFirst("score", "innerText")) || undefined;

  return {
    title,
    description,
    type,
    episodes,
    status,
    mainImage,
    rating,
    genres,
    season,
    airedStart,
    airedEnd,
    duration,
    producers,
    licensors,
    studios,
    sourceMaterialType,
    englishTitle,
    japaneseTitle,
    synonyms,
    sources,
    score,
  };
};

module.exports = webScraper;
