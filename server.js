'use strict';

var express = require('express'),
  routes = require('./app/routers/index.js'),
  mongoose = require('mongoose'),
	session = require('express-session'),
  bodyParser = require('body-parser'),
  path = require("path");

var app = express();
require('dotenv').load();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI);

app.use("static", express.static(path.join(__dirname, "public")));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/node_modules', express.static(process.cwd() + '/node_modules'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/common', express.static(process.cwd() + '/app/common'));

routes(app);

var port = process.env.PORT || 8080;
app.listen(port, function () {
	console.log('Listening on port ' + port + '...');
});
