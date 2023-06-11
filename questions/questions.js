const inquirer = require('inquirer');
const db = require('server');

function start() {
    inquirer
      .prompt([
        {
            type: 'list',
            name: 'beginningOptions',
            message: 'What would you like to do?',
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
    
}