const symbol = $("#nameHeader").attr("data-symbol");
const price = $("#price").attr("data-price");
const numOfShares = parseInt($("#noOfShares").attr("data-shares"));
const searchBtn = $("form.search-btn");
const searchedQuery = $("input#search-query");

function toShowSellBtn() {
  console.log(numOfShares);
  if (numOfShares === 0) {
    console.log($("#sellBtn"));
    $("#sellBtn").addClass("d-none");
  }
}
$("#buyBtn").click(() => {
  event.preventDefault();
  const userId = 1;
  const quantity = parseInt($("#transactionShares").val());
  const data = { symbol, price, quantity, userId };

  $.ajax({
    url: "/api/buy",
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8"
  }).then(() => {
    location.reload();
  });
});

$("#sellBtn").click(() => {
  event.preventDefault();
  const quantity = parseInt($("#transactionShares").val());
  if (numOfShares < quantity) {
    $(".alert-div").removeClass("d-none");
    //Add a message
  } else if (quantity < 0) {
    $(".alert-div").removeClass("d-none");
    console.log("stuff");
  } else {
    const userId = 1;
    const data = { symbol, price, quantity, userId };
    $.ajax({
      url: "/api/sell",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8"
    }).then(() => {
      location.reload();
    });
  }
});

$("#transactionShares").change(() => {
  const quantity = $("#transactionShares").val()
    ? $("#transactionShares").val()
    : 0;

  $("#cost").val(quantity * price);
});

searchBtn.on("submit", event => {
  event.preventDefault();
  console.log("here");
  const stockData = {
    stockSymbol: searchedQuery.val().trim()
  };
  if (!stockData.stockSymbol) {
    return;
  }
  searchStock(stockData.stockSymbol);
  searchedQuery.val("");
});

function searchStock(stockSymbol) {
  $.get(`/stock/${stockSymbol}`)
    .then(() => {
      // add if condition for err
      window.location.replace(`/stock/${stockSymbol}`);
      // If there's an error, log the error
    })
    .catch(err => {
      console.log(err);
    });
}

toShowSellBtn();
