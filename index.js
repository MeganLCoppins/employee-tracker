const mysql = require("mysql");
const inquirer = require("inquirer");

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

  module.exports = connection;

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
            case "Update employee roles":
                updateFunction();
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

// function addRole(){
//     inquirer.prompt([
//         {
//             type: "input",
//             name: "roleTitle",
//             message: "What role would you like to add?"
//         },
//         {
//             type: "input",
//             name: "roleSalary",
//             message: "What is the salary for this role?",
//         },
//         {
//             type: "list",
//             name: "roleID",
//             message: "What department does this role belong in?",
//             choices: ["IT", "Finance", "Human Resources", "Sales"]
//         }
//     ]).then(function(res){
//         connection.query("INSERT INTO employee_role SET ?",
//         {
//             title: res.roleTitle,
//             salary: res.roleSalary,
//             department_id: res.roleID
//         }
//         )
//     })
// }