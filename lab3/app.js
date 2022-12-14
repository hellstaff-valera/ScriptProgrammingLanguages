const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
const app = express();
const jsonParser = express.json();
const mongoClient = new MongoClient("mongodb://localhost:27017", { useUnifiedTopology: true });
let dbClient;

app.use(express.static(__dirname + "/public"));
mongoClient.connect(function (err, client) {
	if (err) return console.log(err);
	dbClient = client;
	app.locals.collection = client.db("employeesdb").collection("employees");
	app.listen(3000, function () {
		console.log("Сервер чекає з'єднання...");
	});
});

app.get("/api/employees", function (req, res) {
	const collection = req.app.locals.collection;
	collection.find({}).toArray(function (err, employees) {
		if (err) return console.log(err);
		res.send(employees)
	});
});

app.get("/api/employees/:id", function (req, res) {
	const id = new objectId(req.params.id);
	const collection = req.app.locals.collection;
	collection.findOne({ _id: id }, function (err, employee) {
		if (err) return console.log(err);
		res.send(employee);
	});
});

app.post("/api/employees", jsonParser, function (req, res) {
	if (!req.body) return res.sendStatus(400);
	const employeeName = req.body.name;
	const employeeAge = req.body.age;
	const employeeSolary = req.body.solary;
	const employee = { name: employeeName, age: employeeAge, solary: employeeSolary };
	const collection = req.app.locals.collection;
	collection.insertOne(employee, function (err) {
		if (err) return console.log(err);
		res.send(employee);
	});
});

app.delete("/api/employees/:id", function (req, res) {
	const id = new objectId(req.params.id);
	const collection = req.app.locals.collection;
	collection.findOneAndDelete({ _id: id }, function (err, result) {
		if (err) return console.log(err);
		let employee = result.value;
		res.send(employee);
	});
});

app.put("/api/employees", jsonParser, function (req, res) {
	if (!req.body) return res.sendStatus(400);
	const id = new objectId(req.body.id);
	const employeeName = req.body.name;
	const employeeAge = req.body.age;
	const employeeSolary = req.body.solary;
	const collection = req.app.locals.collection;
	collection.findOneAndUpdate({ _id: id }, { $set: { solary: employeeSolary, age: employeeAge, name: employeeName } },
		{ returnDocument: 'after' }, function (err, result) {
			if (err) return console.log(err);
			const employee = result.value;
			res.send(employee);
		});
});

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
	dbClient.close();
	process.exit();
});
