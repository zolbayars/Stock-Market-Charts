'use strict'

var request = require("request");

function NetworkRequest(){

  this.send(url, method, params, errorCallback, successCallback, options){

    var reqOptions = options;
    if(!reqOptions){

      reqOptions = {
        method: method,
        url: url,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        qs: params
      }
    }

    request(reqOptions, function(error, response, body){
      if(!error && response.statusCode == 200){
        successCallback(response, body);
      }else{
        errorCallback(response, error);
      }
    });

  }
}

module.exports = NetworkRequest;
