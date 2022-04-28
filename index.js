const inquirer = require('inquirer');
const db = require('./db/connection');

// later change the way we require the queries
// const { getDepartments } = require('./queries/department-queries');
const queries = require('./utils/queries');

db.connect(err => {
    if (err) throw err;
});

const promptMainMenu = () => {
    // eventually need to add more options
    const mainMenuQuestion = {
        type: 'list',
        name: 'mainMenu',
        message: 'What would you like to do?',
        choices: ['View Departments', 'Add Department', 'Exit Application'],
    }

    return inquirer.prompt(mainMenuQuestion)
        .then(mainMenuData => {
            if (mainMenuData.mainMenu === 'View Departments') {
                return queries.getDepartments()
                    .then(promptMainMenu);
            }
            else if (mainMenuData.mainMenu === 'Add Department') {
                return promptAddDepartment()
                    .then(promptMainMenu);
            }
            return;
        });
};

const promptAddDepartment = () => {
    const addDepartmentQuestion = {
        type: 'input',
        name: 'addDepartment',
        message: 'What is the name of the department?'
    };

    return inquirer.prompt(addDepartmentQuestion)
        .then(addDepartmentData => {
            const departmentName = addDepartmentData.addDepartment;
            return queries.addDepartment(departmentName);
        });
};

promptMainMenu().then(() => {
    console.log('Thank you for using our application!');
    db.end();
});