const axios = require("axios");
const FIN_API_KEY = process.env.FIN_API_KEY;
const ALPHA_API_KEY = process.env.ALPHA_API_KEY;
const moment = require("moment");
exports.json = content => {
  return JSON.stringify(content);
};

exports.getQuotes = symbol => {
  return axios.get(
    `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${FIN_API_KEY}`
  );
};

exports.getStock = () => {
  return axios.get(
    `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${FIN_API_KEY}`
  );
};

exports.getHistoricalData = async symbol => {
  const response = await axios.get(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_API_KEY}&limit=7`
  );

  return response.data["Time Series (Daily)"];
};

exports.formatHistorical = (historicalPrice, curPrice) => {
  const priceArr = { dates: [], prices: [] };
  Object.keys(historicalPrice).forEach(key => {
    priceArr.dates.push(moment(key).format("MM/DD/YY"));
    priceArr.prices.push(historicalPrice[key]["4. close"]);
  });
  //Only get the last 7 days
  priceArr.dates = priceArr.dates.slice(0, 7);
  priceArr.prices = priceArr.prices.slice(0, 7);

  //Get current date
  const currentDate = moment().format("MM/DD/YY");

  //Reverse array b/c api brings things in as
  priceArr.dates.reverse();
  priceArr.prices.reverse();

  //Check if it has already end of day is not add
  if (priceArr.dates[6] !== currentDate) {
    priceArr.prices.push(`${curPrice}`);
    priceArr.dates.push(currentDate);
  }

  return priceArr;
};
