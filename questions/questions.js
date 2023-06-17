const inquirer = require('inquirer');
const db = require('./server');

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
        'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, AS Department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee e INNER JOIN roles r ON employee.role_id = role.id INNER JOIN departments d on role.departments_id = department.id LEFT JOIN employee ON employee.manager_id = manager.id',
        (err, res) => {
            if (err) throw err;
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
            db.query('SELECT * FROM roles', (err, res) => {
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
    
}