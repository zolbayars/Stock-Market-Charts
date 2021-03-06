//                                                                                                                                                                                                                                                          'use strict'
//
//Get multiple stocks' info from the API and turning them into an array
function StockController(){

  var NetworkRequest = require(process.cwd() + "/app/common/networkRequest.js");

  var stockAPIUrl = 'https://www.alphavantage.co/query';
  var stockAPIParams = {
    apikey: process.env.ALPHAVANTAGE_API_KEY,
    function: 'TIME_SERIES_DAILY'
  };

  var networkRequest = new NetworkRequest();

  this.getStocksInfo = function(req, res){

    var resultArray = [];
    console.log(req.params);
    var symbols = req.params.symbols.split(",");
    var apiResponseCounter = 0;

    symbols.forEach(function(element){

      stockAPIParams.symbol = element;
      networkRequest.send(stockAPIUrl, 'GET', stockAPIParams,
        function(response, error){
          // resultArray[element] = null;
          sendResIfReached();
        },
        function(response, body){
          var obj = JSON.parse(response.body)["Time Series (Daily)"];
          console.log("Result for "+element);
          resultArray.push(getDailyData(obj));
          sendResIfReached();
        });

    });

    function sendResIfReached(){
      // console.log(resultArray);
      console.log("called: "+apiResponseCounter);
      apiResponseCounter++;
      if(apiResponseCounter >= symbols.length){
        console.log("now it's time to send the res");
        console.log(apiResponseCounter +' - '+symbols.length);
        res.json(resultArray);
      }
    }

  }
}

function getDailyData(obj){
  var result = Object.keys(obj).map(function(e) {
    obj[e].date = e;
    return {
      date: e,
      open: +obj[e]['1. open'],
      high: +obj[e]['2. high'],
      low: +obj[e]['3. low'],
      close: +obj[e]['4. close'],
      volume: +obj[e]['5. volume']
    }
  });

  return result;
}

module.exports = StockController;
