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
        }
    } catch (err){
        throw err;
    }
}
module.exports = start();