                                                                                                                                                                                                                                                         'use strict'

var request =  require("request");

function StockController(){

  this.getStocksInfo = function(req, res){

  }
}

function getStockFromAPI(symbol, callback){
  var options = {
      method: 'GET',
      url: 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AMZN&apikey=Y0W8FJVMBZ4PGPYU',
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      }
  };
}

module.exports = StockController;
