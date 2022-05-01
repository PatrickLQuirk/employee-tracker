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
        choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Exit Application'],
    }

    return inquirer.prompt(mainMenuQuestion)
        .then(mainMenuData => {
            if (mainMenuData.mainMenu === 'View Departments') {
                return queries.getDepartments()
                    .then(promptMainMenu);
            }
            else if (mainMenuData.mainMenu === 'View Roles') {
                return queries.getRoles()
                    .then(promptMainMenu);
            }
            else if (mainMenuData.mainMenu === 'View Employees') {
                return queries.getEmployees()
                    .then(promptMainMenu);
            }
            else if (mainMenuData.mainMenu === 'Add Department') {
                return promptAddDepartment()
                    .then(promptMainMenu);
            }
            else if (mainMenuData.mainMenu === 'Add Role') {
                return promptAddRole()
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

const promptAddRole = () => {
    const addRoleQuestions = [
        {
            type: 'input',
            name: 'title',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?'
        },
        {
            type: 'input',
            name: 'departmentName',
            message: 'Which department does the role belong to?'
        }
    ];

    return inquirer.prompt(addRoleQuestions)
        .then(addRoleData => {
            return queries.addRole(addRoleData);
        });
}

promptMainMenu().then(() => {
    console.log('Thank you for using our application!');
    db.end();
});