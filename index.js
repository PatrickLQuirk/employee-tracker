const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

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
                    .then(([rows, fields]) => {
                        console.table(rows);
                    })
                    .then(promptMainMenu);
            }
            else if (mainMenuData.mainMenu === 'View Roles') {
                return queries.getRoles()
                    .then(([rows, fields]) => {
                        console.table(rows);
                    })
                    .then(promptMainMenu);
            }
            else if (mainMenuData.mainMenu === 'View Employees') {
                return queries.getEmployees()
                    .then(([rows, fields]) => {
                        console.table(rows);
                    })
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
            else if (mainMenuData.mainMenu === 'Add Employee') {
                return promptAddEmployee()
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

const promptAddEmployee = () => {
    const addEmployeeQuestions = [
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?"
        },
        {
            type: 'input',
            name: 'roleName',
            message: "What is the employee's role?"
        },
        {
            type: 'input',
            name: 'managerName',
            message: "Who is the employee's manager?"
        }
    ];

    return inquirer.prompt(addEmployeeQuestions)
        .then(addEmployeeData => {
            return queries.addEmployee(addEmployeeData);
        });
};

promptMainMenu().then(() => {
    console.log('Thank you for using our application!');
    db.end();
});