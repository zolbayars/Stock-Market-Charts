'use strict';

var path = process.cwd();
var StockController = require(path + "/app/controllers/stockController.server.js");

module.exports = function(app){

  var stockController = new StockController();

  app.route('/')
    .get(function(req, res){
      res.render('home');
    });

  app.route('/stocks/:symbols')
    .get(stockController.getStocksInfo);

}
