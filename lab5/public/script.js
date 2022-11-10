// get employee by id
async function GetEmployees() {
	const response = await fetch("/api/employees", {
		method: "GET",
		headers: { "Accept": "application/json" }
	});
	if (response.ok === true) {
		const employees = await response.json();
		let rows = document.querySelector("tbody");
		employees.forEach(employee => {
			rows.append(row(employee));
		});
	}
}
// get employee by id
async function GetEmployee(id) {
	const response = await fetch("/api/employees/" + id, {
		method: "GET",
		headers: { "Accept": "application/json" }
	});
	if (response.ok === true) {
		const employee = await response.json();
		const form = document.forms["employeeForm"];
		form.elements["id"].value = employee._id;
		form.elements["name"].value = employee.name;
		form.elements["age"].value = employee.age;
		form.elements["solary"].value = employee.solary;
	}
}
// Add employee
async function CreateEmployee(name, age, solary) {
	const response = await fetch("api/employees", {
		method: "POST",
		headers: { "Accept": "application/json", "Content-Type": "application/json" },
		body: JSON.stringify({
			name: name,
			age: parseInt(age),
			solary: parseFloat(solary),
		})
	});
	if (response.ok === true) {
		const employee = await response.json();
		reset();
		document.querySelector("tbody").append(row(employee));
	}
}
// Edit employee
async function EditEmployee(employeeId, employeeName, employeeAge, employeeSolary) {
	const response = await fetch("api/employees", {
		method: "PUT",
		headers: { "Accept": "application/json", "Content-Type": "application/json" },
		body: JSON.stringify({
			id: employeeId,
			name: employeeName,
			age: parseInt(employeeAge),
			solary: parseFloat(employeeSolary),
		})
	});
	if (response.ok === true) {
		const employee = await response.json();
		reset();
		console.log(employee);
		document.querySelector("tr[data-rowid='" + employee._id + "']").replaceWith(row(employee));
	}
}
// Delete employee
async function DeleteEmployee(id) {
	const response = await fetch("/api/employees/" + id, {
		method: "DELETE",
		headers: { "Accept": "application/json" }
	});
	if (response.ok === true) {
		const employee = await response.json();
		document.querySelector("tr[data-rowid='" + employee._id + "']").remove();
	}
}
// Reset of form
function reset() {
	const form = document.forms["employeeForm"];
	form.reset();
	form.elements["id"].value = 0;
}
// create the row of table
function row(employee) {
	const tr = document.createElement("tr");
	tr.setAttribute("data-rowid", employee._id);
	const idTd = document.createElement("td");
	idTd.append(employee._id);
	tr.append(idTd);
	const nameTd = document.createElement("td");
	nameTd.append(employee.name);
	tr.append(nameTd);
	const ageTd = document.createElement("td");
	ageTd.append(employee.age);
	tr.append(ageTd);
	const solaryTd = document.createElement("td");
	solaryTd.append(employee.solary);
	tr.append(solaryTd);
	const linksTd = document.createElement("td");
	const editLink = document.createElement("a");
	editLink.setAttribute("data-id", employee._id);
	editLink.setAttribute("style", "cursor:pointer;padding:15px;");
	editLink.append("Редагувати");
	editLink.addEventListener("click", e => {
		e.preventDefault();
		GetEmployee(employee._id);
	});
	linksTd.append(editLink);
	const removeLink = document.createElement("a");
	removeLink.setAttribute("data-id", employee._id);
	removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
	removeLink.append("Видалити");
	removeLink.addEventListener("click", e => {
		e.preventDefault();
		DeleteEmployee(employee._id);
	});
	linksTd.append(removeLink);
	tr.appendChild(linksTd);
	return tr;
}
// reset values in the form
document.getElementById("reset").addEventListener("click", (function (e) {
	e.preventDefault();
	reset();
}));
// send form
document.forms["employeeForm"].addEventListener("submit", e => {
	e.preventDefault();
	const form = document.forms["employeeForm"];
	const id = form.elements["id"].value;
	const name = form.elements["name"].value;
	const age = form.elements["age"].value;
	const solary = form.elements["solary"].value;
	if (id == 0) {
		CreateEmployee(name, age, solary);
	}
	else {
		EditEmployee(id, name, age, solary);
	}
});
// get, load employees
GetEmployees();