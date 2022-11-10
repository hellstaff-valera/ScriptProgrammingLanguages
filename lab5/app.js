const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const {
	MONGO_DB_HOSTNAME,
	MONGO_DB_PORT,
	MONGO_DB
} = process.env

const options = {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useFindAndModify: false
}

const url = `mongodb://${MONGO_DB_HOSTNAME}:${MONGO_DB_PORT}/${MONGO_DB}`;

const employeeSchema = new Schema(
	{
		name: String,
		age: Number,
		solary: Number,
	},
	{
		versionKey: false
	}
);
const Employee = mongoose.model("Employee", employeeSchema);

app.use(express.static(__dirname + "/public"));
mongoose.connect(url, options, function (err) {
	if (err) return console.log(err);
	app.listen(3000, function () {
		console.log("Сервер чекає з'єднання...");
	});
});

app.get("/api/employees", function (req, res) {
	Employee.find({}, function (err, employees) {
		if (err) return console.log(err);
		res.send(employees)
	});
});

app.get("/api/employees/:id", function (req, res) {
	const id = req.params.id;
	Employee.findOne({ _id: id }, function (err, employee) {
		if (err) return console.log(err);
		res.send(employee);
	});
});

app.post("/api/employees", jsonParser, function (req, res) {
	if (!req.body) return res.sendStatus(400);
	const employeeName = req.body.name;
	const employeeAge = req.body.age;
	const employeeSolary = req.body.solary;
	const employee = new Employee({ name: employeeName, age: employeeAge, solary: employeeSolary });
	employee.save(function (err) {
		if (err) return console.log(err);
		res.send(employee);
	});
});

app.delete("/api/employees/:id", function (req, res) {
	const id = req.params.id;
	Employee.findByIdAndDelete(id, function (err, employee) {
		if (err) return console.log(err);
		res.send(employee);
	});
});

app.put("/api/employees", jsonParser, function (req, res) {
	if (!req.body) return res.sendStatus(400);
	const id = req.body.id;
	const employeeName = req.body.name;
	const employeeAge = req.body.age;
	const employeeSolary = req.body.solary;
	const newEmployee = { name: employeeName, age: employeeAge, solary: employeeSolary };
	Employee.findOneAndUpdate({ _id: id }, newEmployee,
		{ new: true },
		function (err, employee) {
			if (err) return console.log(err);
			res.send(employee);
		});
});
