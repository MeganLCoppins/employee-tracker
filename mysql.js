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

  // function which prompts the user for what action they should take
async function start() {
    try{
        const choiceType = await inquirer.prompt({
            name: "choice",
            type: "list",
            message: "Would you like to add or view departments, roles, employees or update employee roles?",
            choices: ["Add departments, roles, employees", "View departments, roles, employees", "Update employee roles", "EXIT"]
        });
        if(choiceType.choice === "Add departments, roles, employees"){
            addFunction();
        } else if(choiceType.choice === "View departments, roles, employees"){
            viewFunction();
        } else if (choiceType.choice === "Update employee roles"){
            updateFunction();
        } else {
            connection.end();
        };
    } catch (err){
        throw err;
    };
};