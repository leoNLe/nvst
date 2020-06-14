const axios = require("axios");
const FIN_API_KEY = process.env.FIN_API_KEY;

exports.json = content => {
  return JSON.stringify(content);
};

exports.getQuotes = async symbol => {
  return axios.get(
    `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${FIN_API_KEY}`
  );
};
