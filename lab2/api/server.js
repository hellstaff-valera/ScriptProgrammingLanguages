//server.js

require('dotenv').config();

const express = require('express');
const app = express();

app.get("/", (req, res) => {
	res.send({ message: 'Hello World' });
});

app.get("/new", (req, res) => {
	res.send({ message: process.env.HELLO + " I'm " + process.env.NAME + ", I'm " + process.env.AGE });
});

module.exports = app;