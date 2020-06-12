const fetch = require("node-fetch");
const graphql = require("graphql");
const getSymbols = () => {
  return fetch(
    "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=brcsl7nrh5rfdvppg6q0"
  ).then(response => {
    return response.json();
  });
};

const symbolsRes = () => {
  return getSymbols();
};

const typeSymbol = graphql.GraphQLObjectType({
  name: "Symbol",
  fields: {
    description: { type: graphql.GraphQLString },
    symbol: { type: graphql.GraphQLString },
    displaySymbol: { type: graphql.GraphQLString }
  }
});

const endpoint = {
    type: new graphql.GraphQLList(symbolType),
  resolve: symbolsRes
}

module.exports = { endpoint, type: new graphql.GraphQLList(typeSymbol) };
