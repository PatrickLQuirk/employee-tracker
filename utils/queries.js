const db = require('../db/connection');

const getDepartments = () => {
    const sql = `SELECT * FROM department`;

    return db.promise().query(sql);
};

const getRoles = () => {
    const sql = `SELECT role.*, department.name 
                AS department_name
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id`;
    
    return db.promise().query(sql);
};

const getEmployees = () => {

    // The following sql query is quite complicated, so I will break it down in some comments.
    // The attributes that we want for an employee are their id, their first name, their last name,
    //      the title of their role, the department their role belongs to, their salary,
    //      and the name of their manager (if they have one).
    // To get the title of their role and their salary, we have to LEFT JOIN with the 'role' table.
    //      The foreign key for the role table is role_id, which references role.id
    // To get the department that the role belongs to, we have to LEFT JOIN with the 'department' table,
    //      using the foreign key from role (since that is where the reference to the department is).
    // Finally, we have the manager name, which is complicated.
    //      We have to LEFT JOIN the employee table with itself, which necessitates two different references
    //      to the employee table. The first one I am calling employeeA, as seen in the `FROM employee employeeA`
    //      statement. The second one, which is solely there for the manager name, I am calling employeeB 
    //      (see `LEFT JOIN employee employeeB`).
    //      The other part of this is that we want the full name of the manager, which requires the CONCAT statement.
    //      The `' '` is there to put a space between the manager's first and last names.

    const sql = `SELECT employeeA.id, employeeA.first_name, employeeA.last_name,
    role.title as role_title,
    department.name as department_name,
    role.salary AS salary,
    CONCAT(employeeB.first_name, ' ', employeeB.last_name) AS manager_name
    FROM employee employeeA
    LEFT JOIN role
    ON employeeA.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee employeeB
    ON employeeA.manager_id = employeeB.id`;

    return db.promise().query(sql);
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

const getRoleId = (roleTitle) => {
    const sql = `SELECT role.id FROM role
                WHERE role.title = ?`;
    const params = [roleTitle];

    return db.promise().query(sql, params)
        .then( ([rows, fields]) => {
            const roleId = rows[0].id;
            return roleId;
        })
};

const getManagerId = (managerName) => {
    const sql = `SELECT employee.id FROM employee
                WHERE CONCAT(employee.first_name, ' ', employee.last_name) = ?`;
    const params = [managerName];

    return db.promise().query(sql, params)
        .then( ([rows, fields]) => {
            const managerId = rows[0].id;
            return managerId;
        })
        .catch(err => {
            return;
        })
}

const addEmployee = (employeeData) => {
    return getRoleId(employeeData.roleName)
    .then(roleId => {
        return getManagerId(employeeData.managerName)
            .then(managerId => {
                // there is probably a better way to handle the differences in the queries when there is no managerId
                if (managerId) {
                    var sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`;
                    var params = [employeeData.firstName, employeeData.lastName, roleId, managerId];
                } else {
                    var sql = `INSERT INTO employee (first_name, last_name, role_id)
                    VALUES (?, ?, ?)`;
                    var params = [employeeData.firstName, employeeData.lastName, roleId];
                }

                return db.promise().query(sql, params)
                    .then(() => {
                        console.log('Added ' + employeeData.firstName + ' ' + employeeData.lastName + ' to the database');
                    });
            });
    });
};

const getEmployeeNames = () => {
    const sql = `SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee`;
    return db.promise().query(sql)
        .then(([rows, fields]) => {
            const employeeNames = rows.map(row => {
                return row.name;
            });
            return employeeNames;
        });
};

const getEmployeeId = (employeeName) => {
    const sql = `SELECT employee.id FROM employee
                WHERE CONCAT(employee.first_name, ' ', employee.last_name) = ?`;
    const params = [employeeName];
    return db.promise().query(sql, params)
        .then( ([rows, fields]) => {
            return rows[0].id;
        });
};

const updateEmployeeRole = (updateRoleData) => {
    return getEmployeeId(updateRoleData.employeeName)
        .then(employeeId => {
            return getRoleId(updateRoleData.newRole)
            .then(newRoleId => {
                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                const params = [newRoleId, employeeId];

                return db.promise().query(sql, params)
                    .then(([rows, fields]) => {
                        console.log("Updated " + updateRoleData.employeeName + "'s role to " + updateRoleData.newRole);
                    });
            });
        });
};

module.exports = { getDepartments, getRoles, getEmployees, addDepartment, addRole, addEmployee, getEmployeeNames, updateEmployeeRole };