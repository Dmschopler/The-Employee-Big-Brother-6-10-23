const inquirer = require('inquirer');
const db = require('../connection/connection');
const consoleTables = require('console.table')

function start() {
    inquirer
      .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'beginningOptions',
            choices: [
                'View all Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Quit'
            ],
        },
      ])
      .then(({ beginningOptions }) => {
        if (beginningOptions === 'View All Employees') {
            viewStaff();
        } else if (beginningOptions === 'Add Employee') {
            addStaff();
        } else if (beginningOptions === 'Update Employee Role') {
            updateStaff();
        } else if (beginningOptions === 'View All Roles') {
            viewAllRoles();
        } else if (beginningOptions === 'Add Role') {
            addRole();
        } else if (beginningOptions === 'View All Departments') {
            viewAllDepartments();
        } else if (beginningOptions === 'Add Department') {
            addDepartment();
        } else if (beginningOptions === 'Quit') {
            quit();
        }
      })
      .catch((err) => {
        console.log(err);
        console.log('Something went wrong');
      });
}

const viewStaff = () => {
    db.query(
        'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department on role.department_id = department.id',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
        }
    );
};

const addStaff = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the first name of the new employee?',
                name: 'first',
            },
            {
                type: 'input',
                message: 'What is the last name of the new employee?',
                name: 'last',
            },
        ])
        .then((answer) => {
            const employeeFirst = answer.first;
            const employeeLast = answer.last;
            db.query('SELECT * FROM role', (err, res) => {
                if (err) throw err;
                inquirer
                .prompt([
                    {
                        type: 'list',
                        message: 'What is the role of the new employee?',
                        name: 'newRole',
                        choices: res.map((role) => role.title),
                    },
                ])
                .then((answer) => {
                    const selectedRole = res.find(
                        (role) => role.title === answer.newRole
                    );
                    db.query('SELECT * FROM employee', (err, res) => {
                        if (err) throw err;
                        inquirer
                        .prompt([
                            {
                            type: 'list',
                            message: 'Who is the new employee manager?',
                            name: 'newEmployeeManager',
                            choices: res.map(
                                (employee) => employee.first_name + ' ' + employee.last_name
                            ),
                            },
                        ])
                        .then((answer) => {
                            const selectedEmployee = res.find(
                                (employee) => employee.first_name + ' ' + employee.last_name === answer.newEmployeeManager
                            );
                            db.query(
                                'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',
                                [
                                    employeeFirst,
                                    employeeLast,
                                    selectedRole.id,
                                    selectedEmployee.id,
                                ],
                                (err, res) => {
                                    if (err) throw err;
                                    else {
                                        console.log('Employee added to database!');
                                    }
                                    start();
                                }
                            );
                        });
                    });
                });
            });
        });
};

const updateStaff = () => {
    db.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select which employee you want to change roles.',
                name: 'roleChange',
                choices: res.map((employee) => employee.first_name + ' ' + employee.last_name),
            },
        ])
        .then((answer) => {
            const selectedEmployee = res.find(
                (employee) => employee.first_name + ' ' + employee.last_name === answer.roleChange
            );
            db.query('SELECT * FROM role', (err, res) => {
                if (err) throw err;
                inquirer
                .prompt([
                    {
                        type: 'list',
                        message: 'What new role do you want for this employee?',
                        name: 'newRole',
                        choices: res.map((role) => role.title),
                    },
                ])
                .then((answer) => {
                    const selectedRole = res.find(
                        (role) => role.title === answer.newRole
                    );
                    db.query('UPDATE employee SET role_id = ? WHERE id=?',
                    [selectedRole.id, selectedEmployee.id],
                    (err, res) => {
                        if (err) throw err;
                        else {
                            console.log('The employee role has been updated!');
                        }
                        start();
                      }
                    );
                });
            });
        });
    });
};

const viewAllRoles = () => {
    db.query('SELECT role.id, role.title, role.salary, department.department_name AS department FROM role JOIN department ON role.department_id = department.id',
    (err, res) => {
        console.table(res);
        start();
      }
    );
};

const addRole = () => {
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'What role would you like to add?',
            name: 'addedRole',
        },
        {
            type: 'input',
            message: 'How much do you want to pay this role?',
            name: 'roleSalary',
        },
    ])
    .then((answer) => {
        const addedRole = answer.addedRole;
        const roleSalary = answer.roleSalary;
        db.query('SELECT * FROM deparment', (err, res) => {
            if (err) throw err;
            inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Where do you want to add this role?',
                    name: 'newRolePlacement',
                    choices: res.map((department) => department.department_name),
                },
            ])
            .then((answer) => {
                const newPlacement = res.find(
                    (department) => department.department_name === answer.newRolePlacement
                );
                db.query('INSERT INTO role (title, department_id, salary) VALUES (?,?,?)',
                [addedRole, newPlacement.id, roleSalary],
                (err, res) => {
                    if (err) throw err;
                    else {
                        console.log('New role added to database!');
                    }
                    start();
                  }
                );
            });
        });
    });
};

const viewAllDepartments = () => {
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
};

const addDepartment = () => {
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'What department would you like to add?',
            name: 'newDepartment',
        },
    ])
    .then((answer) => {
        const departmentAdded = answer.newDepartment;
        db.query('INSERT INTO department (department_name) VALUES (?)',
        [departmentAdded],
        (err, res) => {
            if (err) throw err;
            else{
                console.log('The new department was added!');
            }
            start();
          }
        );
    });
};

const quit = () => {
    console.log('Quitting out of the application.');
    process.exit();
};

module.exports = start;

