import JikanTS from "jikants";
import cleanMalArrayFields from "../utils/cleanMalArrayFields";
import determineStatus from "../utils/determineStatus";
import determineType from "../utils/determineType";

const apiScraper = async (
  ayakashi: import("@ayakashi/types").IAyakashiInstance,
  input: { id: number; index: number; total: number }
) => {
  // if full run
  if (input) {
    // wait x ms between runs to prevent throttling
    console.log(
      `🟣 [IDLE] - (${input.index + 1}/${
        input.total
      }) - Waiting to prevent throttle...`
    );
    // await ayakashi.wait(10000 + Math.floor(Math.random() * 5000));

    // give status update
    console.log(`🟡 [IN PROGRESS] - (${input.index + 1}/${input.total})`);
  }

  const malAnime = await JikanTS.Anime.byId(input.id);
  if (!malAnime) {
    console.log(`no Anime for Id ${input?.id}`);
    return null;
  }
  const anime = {
    title: malAnime?.title,
    description: malAnime?.synopsis,
    trailer: malAnime?.trailer_url,
    type: determineType(malAnime?.type || ""),
    episodes: malAnime?.episodes,
    status: determineStatus(malAnime?.status || ""),
    mainImage: malAnime?.image_url,
    rating: malAnime?.rating,
    genres: cleanMalArrayFields(malAnime?.genres).map(
      ({ url, ...genre }) => genre.name
    ),
    season: malAnime?.premiered?.split(" ")[0],
    airedStart: malAnime?.aired
      ? new Date(malAnime?.aired?.from).toISOString()
      : null,
    airedEnd: malAnime?.aired
      ? new Date(malAnime?.aired?.to).toISOString()
      : null,
    duration: malAnime?.duration,
    producers: cleanMalArrayFields(malAnime?.producers),
    licensors: cleanMalArrayFields(malAnime?.licensors),
    studios: cleanMalArrayFields(malAnime?.studios),
    sourceMaterialType: malAnime?.source,
    englishTitle: malAnime?.title_english,
    japaneseTitle: malAnime?.title_japanese,
    synonyms: malAnime?.title_synonyms,
    sources: malAnime ? [{ name: "MyAnimeList", url: malAnime?.url }] : [],
    score: malAnime?.score,
  };

  if (anime.genres.includes("Hentai")) {
    console.log(`🔵 [SKIPPED] - Hentai detected, skipping item...`);
    return null;
  }
  return anime;
};

export default apiScraper;
