import { AnimeById } from "jikants/dist/src/interfaces/anime/ById";

const cleanMalArrayFields = (array: AnimeById["genres"] | undefined) =>
  array ? array.map(({ mal_id, type, ...rest }) => rest) : [];

export default cleanMalArrayFields;
