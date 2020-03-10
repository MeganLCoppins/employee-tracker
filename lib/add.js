const inquirer = require("inquirer");
const connection = require("connection");

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
                name: answer.department
            },
            function(err) {
                if (err) throw err;
                console.log("Your department was added successfully!");

                start();
            }
        )
    })
}

// function to add employee
// function addEmployee(){
//     inquirer.prompt([
//         {
//             type: "input",
//             name: "employeeFirst",
//             message: "What is the employees first name?"
//         },
//         {
//             type: "input",
//             name: "employeeLast",
//             message: "What is the employees last name?"
//         },
//         {
//             type: "input",
//             name: "manager",
//             message: "Who is the employees manager?",
//             choices: ["No Manager", "IT Manager", "Finance Manager", "HR Manager", "Sales Manager"]
//         }
//     ]).then(function(response){
//         switch (response.manager){
//             case "No Manager":
//                 managerType();
//                 break;
//         }
//     })
// }

module.exports = addFunction;
module.exports = addDepartment;

// {
//     type: "list",
//     name: "role",
//     message: "What is the employees role?",
//     choices: ["Senior Developer", "IT Manager", "Accountant", "Finance Manager", "HR Rep", "HR Manager", "Sales Rep", "Sales Manager"]
// },