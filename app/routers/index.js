'use strict'

var path = process.cwd();
var StockController = require(process.cwd() + "/app/controllers/stockController.server.js");

module.exports = function(app){

  var stockController = new StockController();

  app.route('/')
    .get(function(req, res){
      res.render('home');
    });

  app.route('/stocks')
    .get(function(req, res){
      stockController.getStocksInfo; 
    });

}
