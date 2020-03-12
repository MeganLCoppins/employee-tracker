require("console.table");
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

// function which prompts the user for what action they want to take
  function start() {
    inquirer.prompt([
        {
            name: "choice",
            type: "list",
            message: "Would you like to add or view departments, roles, employees or update employee roles?",
            choices: ["Add departments, roles, employees", "View departments, roles, employees", "Update employee role", "EXIT"]
        }
    ]).then(function(res){
        switch(res.choice){
            case "Add departments, roles, employees":
                addFunction();
                break;
            case "View departments, roles, employees":
                viewFunction();
                break;
            case "Update employee role":
                updateRole();
                break;
            case "EXIT":
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
    // prompt user to choose from applications beginning options
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
                type: "list",
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
    // prompt user to choose from applications beginning options
                start();
            });
        });
    });
};

// function to get the role the added employee will be filling
function addEmployee(){
    connection.query("SELECT * FROM employee_role", function(err, results){
        if(err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "role",
                message: "What role will the employing be filling?",
                choices: function(){
                    var roleChoice = [];
                    for(var i=0; i < results.length; i++){
                        roleChoice.push(results[i].title);
                    }
                    return roleChoice;
                }
            }
        ]).then(function(res){
            var chosenRole;
            for (var i = 0; i < results.length; i++){
                if(results[i].title === res.role){
                    chosenRole = results[i]
                }
            }
            getManager(chosenRole.id);
        })
    })
}
// function to get employees manager if they have one and then add new employee
function getManager(chosenRole){
    connection.query("SELECT employee.manager_id, CONCAT(manager.first_name, ' ', manager.last_name) AS managerName FROM employee LEFT JOIN employee AS manager on manager.id = employee.manager_id WHERE employee.manager_id IS NOT NULL", function(err, results){
        if(err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employees first name?",
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the employees last name?"
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the employees manager?",
        // grabbing existing managers to choose from
                choices: function() {
                    var managerChoice = [];
                    for (var i = 0; i < results.length; i++) {
                      managerChoice.push(results[i].managerName);
                    }
        // option if employee has no manager
                    managerChoice.push("Does not have a manager");
                    return managerChoice;
                }
            }
        ]).then(function(res){
            var chosenManager;
            for (var i=0; i < results.length; i++){
                if(res.manager === "Does not have a manager"){
                    chosenManager = "";
                }else if(results[i].managerName === res.manager){
                    chosenManager = results[i]
                }
            }
            connection.query("INSERT INTO employee SET ?",
            {
                first_name: res.firstName,
                last_name: res.lastName,
                role_id: chosenRole,
                manager_id: chosenManager.manager_id
            },
            function(err){
                if(err) throw err;
                console.log("Your employee was added!");
    // prompt user to choose from applications beginning options
                start();
            })
        })
    });
};

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
            case "Departments":
                viewDepartments();
                break;
            case "Employees":
                viewEmployees();
                break;
            case "Roles":
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
    // prompt user to choose from applications beginning options
        start();
    });
};
// to view employee roles
function viewRoles(){
    connection.query("SELECT * FROM employee_role", function(err, res){
        if(err) throw err;
        console.table(res);
    // prompt user to choose from applications beginning options
        start();
    });
};
// to view employees
function viewEmployees(){
    connection.query("SELECT * FROM employee", function(err, res){
        if(err) throw err;
        console.table(res);
    // prompt user to choose from applications beginning options
        start();
    });
};

// function to chose what role to update to
function updateRole(){
    connection.query("SELECT * FROM employee_role", function(err, results){
        if(err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "role",
                message: "What is the role going to be updated to?",
                choices: function(){
                    var roleChosen = [];
                    for(var i = 0; i < results.length; i++){
                        roleChosen.push(results[i].title);
                    }
                    return roleChosen;
                }
            }
        ]).then(function(res){
            var roleChoice;
            for (var i = 0; i < results.length; i++){
                if(results[i].title === res.role){
                    roleChoice = results[i]
                }
            }
            updateFunction(roleChoice.id);
        })
    })
}
// select employee and update employee role
function updateFunction(roleChoice){
    connection.query("SELECT * FROM employee", function(err, results){
        if(err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "employeeID",
                message: "For which employee would you like to update their role?",
                choices: function(){
                    var employeeChoice = [];
                    for(var i = 0; i < results.length; i++){
                        employeeChoice.push(results[i].first_name);
                    }
                    return employeeChoice;
                }
            },
        ]).then(function(res){
            var employeeChosen;
            for (var i = 0; i < results.length; i++){
                if(results[i].first_name === res.employeeID){
                    employeeChosen = results[i]
                }
            }
            connection.query("UPDATE employee SET ? WHERE ?",[
            {
                role_id: roleChoice
            },
            {
                id: employeeChosen.id
            }],
            function(err){
                if(err) throw err;
                console.log("Employee role was updated!");
    // prompt user to choose from applications beginning options
                start();
            }
            )
        });
    });
}