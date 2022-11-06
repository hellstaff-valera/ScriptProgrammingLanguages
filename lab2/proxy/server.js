//server.js
const express = require('express');
const config = require('./config.js');
const client = require('./client.js');
const app = express();

app.get("/new", function (request, response, next) {
	client.get_data(config.get('src'))
		.then(result => {
			response.send(result);
		});
});

app.use("/", function (request, response, next) {
	client.get_data(config.get('env'))
		.then(result => {
			response.send(result);
		});
});

module.exports = app;