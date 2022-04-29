const cTable = require('console.table');
const db = require('../db/connection');

const getDepartments = () => {
    const sql = `SELECT * FROM department`;

    return db.promise().query(sql)
        .then( ([rows, fields]) => {
            console.table(rows);
        });
};

const getRoles = () => {
    const sql = `SELECT role.*, department.name 
                AS department_name
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id`;
    
    return db.promise().query(sql)
        .then( ([rows, fields]) => {
            console.table(rows);
        });
};

const addDepartment = (departmentName) => {
    const sql = `INSERT INTO department (name)
    VALUES (?)`;
    const params = [departmentName];
    
    return db.promise().query(sql, params)
        .then(() => {
            console.log('Added ' + departmentName + ' to the database');
        });
};

const getDepartmentId = (departmentName) => {
    const sql = `SELECT department.id FROM department
                WHERE department.name = ?`;
    const params = [departmentName];
    
    return db.promise().query(sql, params)
        .then( ([rows, fields]) => {
            // add error handling for no department with that name
            const departmentId = rows[0].id;
            return departmentId;
        });
}

const addRole = (roleData) => {
    return getDepartmentId(roleData.departmentName)
        .then(departmentId => {
            const sql = `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`;
            const params = [roleData.title, roleData.salary, departmentId];

            return db.promise().query(sql, params)
                .then(() => {
                    console.log('Added ' + roleData.title + ' to the database');
                });
        });
};

module.exports = { getDepartments, getRoles, addDepartment, addRole };