const cTable = require('console.table');
const db = require('../db/connection');

const getDepartments = () => {
    const sql = `SELECT * FROM department`;

    return db.promise().query(sql)
        .then( ([rows, fields]) => {
            console.table(rows);
        });
};

module.exports = { getDepartments };