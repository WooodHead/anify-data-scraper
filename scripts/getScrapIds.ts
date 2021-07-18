const getScrapIds = async () => {
  const arrayOf50kNums = Array.from(Array(50000)).map((_, idx) => idx + 1);

  const ids = arrayOf50kNums.map((entry, index) => {
    return {
      id: entry,
      index,
      total: arrayOf50kNums.length,
    };
  });

  console.log(
    "🟢 [SUCCESS] - ID's generated - Number of ID's to scrap:",
    ids.length
  );

  return ids;
};

module.exports = getScrapIds;
