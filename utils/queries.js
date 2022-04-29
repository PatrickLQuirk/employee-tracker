const cTable = require('console.table');
const db = require('../db/connection');

const getAllFromTable = (tableName) => {
    const sql = `SELECT * FROM ${tableName}`;

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

module.exports = { getAllFromTable, addDepartment };