const mysql = require('mysql2')
const inquirer = require('inquirer')

const db = mysql.createConnection('mysql://root:300Monkeysonfire!!!@localhost/employeeManager_db')

// Need Type, name, message. Prompt for event
const homePage = () => {
  inquirer.prompt([{
    type: 'list',
    name: 'homeSelect',
    message: 'Select an option',
    choices: ['Add Department', 'Add Role', 'Add Employee', 'View Departments', 'View Roles', 'View Employees', 'Update Employee Role', 'Quit']
  }])
    .then(home => {
      switch (home.homeSelect) {
        case 'Add Department':
          addDepartment()
          break

        case 'Add Role':
          addRole()
          break

        case 'Add Employee':
          addEmployee()
          break

        case 'View Departments':
          viewDepartments()
          break

        case 'View Roles':
          viewRoles()
          break

        case 'View Employees':
          viewEmployees()
          break

        case 'Update Employee Role':
          Update()
          break

        case 'Quit':
        quit()
        break

        default:
          console.log('Exiting System')
          break
      }
    })
}

// Adds a department to the db
const addDepartment = () => {
  inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Enter department name:'
  }])
    .then(department => {
      db.query('INSERT INTO departments SET ?', department, err => {
        if (err) { console.log(err) }
      })
      console.log('Department added')
      homePage()
    })
}

// Adds a role to the db
const addRole = () => {
  inquirer.prompt([{
    type: 'input',
    name: 'title',
    message: 'Enter title of the role:'
  },
  {
    type: 'input',
    name: 'salary',
    message: 'Enter salary of the role:'
  },
  {
    type: 'input',
    name: 'department_id',
    message: 'Enter ID of the role:'
  }])
    .then(role => {
      db.query('INSERT INTO roles SET ?', role, err => {
        if (err) { console.log(err) }
      })
      console.log('Role added')
      homePage()
    })
}

//adds an employee to the db
const addEmployee = () => {
  inquirer.prompt([{
    type: 'input',
    name: 'first_name',
    message: 'Enter the first name of the employee:'
  },
  {
    type: 'input',
    name: 'last_name',
    message: 'Enter the last name of the employee:'
  },
  {
    type: 'input',
    name: 'role_id',
    message: 'Enter the ID of the employee:'
  },
  {
    type: 'list',
    name: 'managerBool',
    message: 'Is the employee a manager?',
    choices: ['Yes', 'No']
  }])
    .then(manager => {
      if (manager.managerBool === 'Yes') {
        delete manager.managerBool
        db.query('INSERT INTO employees SET ?', manager, err => {
          if (err) { console.log(err) }
        })
        console.log('Manager added')
        homePage()

      } else if (manager.managerBool === 'No') {
        inquirer.prompt([{
          type: 'input',
          name: 'manager_id',
          message: 'Enter the ID of employee\'s manager:'
        }])
          .then(employee => {

            delete manager.managerBool

            let regEmployee = {
              ...manager,
              ...employee
            }

            db.query('INSERT INTO employees SET ?', regEmployee, err => {
              if (err) { console.log(err) }
            })
            homePage()
          })
      }
    })
}

const viewDepartments = () => {
  db.query('SELECT * FROM departments', (err, departments) => {
    console.log('\n')
    console.table(departments)
  })
  homeScreen()
}

const viewRoles = () => {
  db.query('SELECT * FROM roles', (err, roles) => {
    console.log('\n')
    console.table(roles)
  })
  homeScreen()
}

const viewEmployees = () => {
  db.query('SELECT * FROM employees', (err, employees) => {
    console.log('\n')
    console.table(employees)
  })
  homeScreen()
}

// Updates employee's role
const Update = () => {
  inquirer.prompt([{
    type: 'input',
    name: 'id',
    message: 'Enter the id of the employee:'
  },
  {
    type: 'input',
    name: 'role_id',
    message: 'Enter the employee\'s new role:'
  }])
  .then(roleChange => {
    let role = { role_id: roleChange.role_id }

    db.query(`UPDATE employees SET ? WHERE id = ${roleChange.id}`, roleChange, err => {
      if (err) { console.log(err) }
    })
    console.log('Role updated, returning to home screen...')
    homeScreen()
  })
}

const quit = () => {
  console.log('Goodbye')
  process.exit(1)
}

homeScreen()