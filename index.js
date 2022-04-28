const inquirer = require('inquirer');
const db = require('./db/connection');

// later change the way we require the queries
const { getDepartments } = require('./queries/department-queries');

db.connect(err => {
    if (err) throw err;
});

const promptMainMenu = () => {
    // eventually need to add more options
    const mainMenuQuestion = {
        type: 'list',
        name: 'mainMenu',
        message: 'What would you like to do?',
        choices: ['View Departments', 'Add Department'],
    }

    return inquirer.prompt(mainMenuQuestion)
        .then(mainMenuData => {
            if (mainMenuData.mainMenu === 'View Departments') {
                return getDepartments()
                    .then(promptMainMenu);
            }
            else if (mainMenuData.mainMenu === 'Add Department') {
                return;
            }
            return;
        });
};

promptMainMenu().then(() => {
    console.log('Thank you for using our application!');
    db.end();
});