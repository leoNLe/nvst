const axios = require("axios");
const FIN_API_KEY = process.env.FIN_API_KEY;
const ALPHA_API_KEY = process.env.ALPHA_API_KEY;
const moment = require("moment");
let historicalPrice = [];
let time;
//5 calls per minute
const callRate = 60 / 5;
const rate = callRate * 1000;
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
  if (!toCallHistoryPrice()) {
    return historicalPrice;
  }
  console.log("here");
  const response = await axios.get(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_API_KEY}&limit=7`
  );

  console.log(
    "response.data.note will have error with note b/c of too much api",
    response.data.note
  );

  historicalPrice = response.data["Time Series (Daily)"];
  return historicalPrice;
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

const toCallHistoryPrice = () => {
  let toCall = false;
  const curTime = new Date();
  if (time === undefined) {
    time = curTime;
    toCall = true;
  } else {
    const elapsedTime = curTime - time;
    console.log(elapsedTime);
    if (elapsedTime >= rate) {
      toCall = true;
      time = curTime;
    }
  }
  return toCall;
};
