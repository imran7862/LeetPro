const axios = require("axios");

const getLanguageById = (language) => {
  const languages = {
    cpp: 54,
    java: 62,
    javascript: 63,
  };
  return languages[language.toLowerCase()] || null;
};

const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: { base64_encoded: "false" },
    headers: {
      "x-rapidapi-key": "d3b159c4bamsha663962188559d0p1cfca2jsn1d153575ddca",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: { submissions },
  };

  try {
    const response = await axios.request(options);
    return Array.isArray(response.data)
      ? response.data
      : response.data?.submissions || null;
  } catch (error) {
    console.error("submitBatch error:", error?.response?.data || error.message);
    return null;
  }
};

const waiting = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const submitToken = async (resultToken) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: resultToken.join(","),
      base64_encoded: "false",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": "d3b159c4bamsha663962188559d0p1cfca2jsn1d153575ddca",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  while (true) {
    try {
      const response = await axios.request(options);
      const result = response.data;

      if (!result?.submissions) return null;

      const isResultReady = result.submissions.every((r) => r.status?.id > 2);
      if (isResultReady) return result.submissions;

      await waiting(1000);
    } catch (error) {
      console.error("submitToken polling error:", error?.response?.data || error.message);
      return null;
    }
  }
};

module.exports = {
  getLanguageById,
  submitBatch,
  submitToken,
};