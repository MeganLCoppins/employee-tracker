require("console.table");
const mysql = require("mysql");
const inquirer = require("inquirer");
// require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "employees_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });

//   module.exports = connection;

// function which prompts the user for what action they should take
  function start() {
    inquirer.prompt([
        {
            name: "choice",
            type: "list",
            message: "Would you like to add or view departments, roles, employees or update employee roles?",
            choices: ["Add departments, roles, employees", "View departments, roles, employees", "Update employee roles", "EXIT"]
        }
    ]).then(function(res){
        switch(res.choice){
            case "Add departments, roles, employees":
                addFunction();
                break;
            case "View departments, roles, employees":
                viewFunction();
            // case "Update employee roles":
            //     updateFunction();
            case "EXIT":
                connection.end();
                break;
        }
    })
};

// prompts which category user would like to add to
function addFunction(){
    inquirer.prompt([
        {
            name: "choice",
            type: "list",
            message: "Would you like to add a department, employee, or role?",
            choices: ["Department", "Employee", "Role", "EXIT"]
        }
    ]).then(function(res){
        switch (res.choice) {
            case "Department":
                addDepartment();
                break;
            case "Employee":
                addEmployee();
                break;
            case "Role":
                addRole();
                break;
            case "EXIT":
                start();
                break;
        };
    });
};

// function to add a department
function addDepartment(){
    inquirer.prompt(
        {
        type: "input",
        name: "department",
        message: "What is the name of the department you would like to add?"
        }
    ).then(function(answer){
        connection.query(
            "INSERT INTO department SET ?",
            {
                department_name: answer.department
            },
            function(err) {
                if (err) throw err;
                console.log("Your department was added successfully!");

                start();
            }
        )
    })
}
// function to add role
function addRole(){
// query for department name and id from department table
    connection.query("SELECT * FROM department", function(err, results){
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "roleTitle",
                message: "What role would you like to add?"
            },
            {
                type: "input",
                name: "roleSalary",
                message: "What is the salary for this role?",
            },
            {
                type: "rawlist",
                name: "departID",
                message: "What department does this role belong in?",
                choices: function() {
                    var deptArray = [];
                    for (var i = 0; i < results.length; i++) {
                      deptArray.push(results[i].department_name);
                    }
                    return deptArray;
                  },
            }
        ]).then(function(res){
            var chosenDepart;
            for (var i=0; i < results.length; i++){
                if(results[i].department_name === res.departID){
                    chosenDepart = results[i]
                }
            }
            connection.query("INSERT INTO employee_role SET ?",
            {
                title: res.roleTitle,
                salary: res.roleSalary,
                department_id: chosenDepart.id
            },
            function(err){
                if(err) throw err;
                console.log("Your role was added successfully!");
                start();
            });
        });
    });
};
// function to add employee
function addEmployee(){
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employees first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employees last name?"
        },
        {
            type: "list",
            name: "manager",
            message: "Does this employee have a manager?",
            choices: ["yes", "no"]
        }
    ]).then(function(res){
        switch(res.manager){
            case "yes":
                addWithManager(res.firstName, res.lastName);
                break;
            case "no":
                addWithoutManager(res.firstName, res.lastName);
                break;
        }
    })
};

// function addWithManager(firstName, lastName){
//     connection.query("SELECT id, title FROM employee_role", (function(err, data){

//     }))
// }
// SELECT id FROM department WHERE department_name = "IT"
// connection.query("SELECT id FROM department WHERE department_name = IT")

// prompts which category user would like to view
function viewFunction(){
    inquirer.prompt([
        {
            name: "choice",
            type: "list",
            message: "Would you like to view departments, employees, or roles?",
            choices: ["Departments", "Employees", "Roles", "EXIT"]
        }
    ]).then(function(res){
        switch (res.choice) {
            case "Department":
                viewDepartments();
                break;
            case "Employee":
                viewEmployees();
                break;
            case "Role":
                viewRoles();
                break;
            case "EXIT":
                start();
                break;
        };
    });
};
// to view departments
function viewDepartments(){
    connection.query("SELECT * FROM department", function(err, res){
        if(err) throw err;
        console.table(res);
        start();
    });
};
// to view employee roles
function viewRoles(){
    connection.query("SELECT * FROM employee_role", function(err, res){
        if(err) throw err;
        console.table(res);
        start();
    });
};
// to view employees
function viewEmployees(){
    connection.query("SELECT * FROM employee", function(err, data){
        console.table(query.sql);
    });
    start();
};