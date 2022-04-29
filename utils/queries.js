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

module.exports = { getDepartments, getRoles, addDepartment };