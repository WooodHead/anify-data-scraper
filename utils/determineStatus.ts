const determineStatus = (rawStatus: string) => {
  if (rawStatus.includes("Finished Airing")) return "finished";
  if (rawStatus.includes("Not yet aired")) return "upcoming";
  if (rawStatus.includes("Currently Airing ")) return "upcoming";
  return "unknown";
};

export default determineStatus;
