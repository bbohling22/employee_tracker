const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

// Configure the MySQL connection properties
const dbConnection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "M&Lbnb123!",
  database: "company_db",
});
dbConnection.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    startPrompt();
  }
});

function startPrompt() {
  inquirer
    .prompt({
      type: "list",
      pageSize: 20,
      name: "task",
      message: "Please choose an action:",
      choices: [
        "View all Departments",
        "View all Roles",
        "View all Employees",
        "Add a new Role",
        "Add a new Department",
        "Add a new Employee",
        "Update an Employee's Role",
        "Nothing else is needed.",
      ],
    })
    .then(function ({ task }) {
      switch (task) {
        case "View all Employees":
          viewAllEmployees();
          break;

        case "Add a new Employee":
          addNewEmployee();
          break;

        case "Update an Employee's Role":
          updateEmployeeRole();
          break;

        case "View all Roles":
          showAllRoles();
          break;

        case "Add a new Role":
          addNewRole();
          break;

        case "View all Departments":
          showAllDepartments();
          break;

        case "Add a new Department":
          addNewDepartment();
          break;

        case "Nothing else is needed.":
          console.log("\nApplication exited.  Have a great day!");
          dbConnection.end();
          break;
      }
    });
}

function viewAllEmployees() {
  dbConnection.query(
    `SELECT employees.id AS 'id' 
    employees.first_name AS 'First Name'
    employees.last_name AS 'Last Name'
    employees.role_id AS 'Role ID'
    employees.manager_id AS 'Manager'`,
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        console.table("\n Here are all the employees in the company:", results);
      }
    }
  );
}

function addNewEmployee() {
  // asks user if what the name of the employee is
  inquirer
    .prompt([
      {
        type: "input",
        name: "employeeFirstName",
        message: "what is the first name of the employee you are adding?",
      },
      {
        type: "input",
        name: "employeeLastName",
        message: "what is the last name of the employee you are adding?",
      },
    ])
    .then((answers) => {
      let newEmployeeInfo = [
        answers.employeeFirstName,
        answers.employeeLastName,
      ];
      // grabs all the roles in the company for the options to be displayed
      let sqlCommand = `SELECT * FROM roles`;
      dbConnection.query(sqlCommand, (err, results) => {
        if (err) {
          console.log(err);
        } else {
          let roles = results.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                pageSize: 12,
                name: "role",
                message: "Select employees Role:",
                choices: roles,
              },
            ])
            .then((roleChoice) => {
              let role = roleChoice.role;
              newEmployeeInfo.push(role);

              let sqlCommand = `SELECT * FROM employees WHERE manager_id is NULL`;
              dbConnection.query(sqlCommand, (err, results) => {
                if (err) {
                  console.log(err);
                } else {
                  let managers = results.map(
                    ({ id, first_name, last_name }) => ({
                      name: first_name + " " + last_name,
                      value: id,
                    })
                  );
                  managers.push({ name: "This is a Manager", value: null });
                  inquirer
                    .prompt({
                      type: "list",
                      pageSize: 12,
                      name: "manager",
                      message: "Who is their Manager?",
                      choices: managers,
                    })
                    .then(function (answer) {
                      let manager = answer.manager;
                      newEmployeeInfo.push(manager);
                      let sqlCommand = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;
                      dbConnection.query(
                        sqlCommand,
                        newEmployeeInfo,
                        (error) => {
                          if (error) {
                            console.log(error);
                          } else {
                            console.log("\n Added Employee \n");
                            startPrompt();
                          }
                        }
                      );
                    });
                }
              });
            });
        }
      });
    });
}
function updateEmployeeRole() {
  let sqlCommand = `SELECT * FROM employees`;

  dbConnection.query(sqlCommand, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      let allEmployees = [];
      results.forEach((results) => {
        allEmployees.push(
          results.id + " " + results.first_name + " " + results.last_name
        );
      });
      inquirer
        .prompt([
          {
            name: "employeeName",
            type: "list",
            message: "Choose an employee's role.",
            choices: allEmployees,
          },
        ])
        .then(function (userAnswers) {
          const employeeName = userAnswers.employeeName;

          let sqlCommand = `SELECT * FROM roles`;
          dbConnection.query(sqlCommand, function (error, results) {
            if (err) {
              console.log(err);
            } else {
              employeeNewRole = [];
              results.forEach((results) => {
                employeeNewRole.push(results.title);
              });
              inquirer
                .prompt([
                  {
                    name: "role",
                    type: "list",
                    message: "Choose a new role for employee",
                    choices: employeeNewRole,
                  },
                ])
                .then(function (newRoleResponce) {
                  let newRole = newRoleResponce.role;

                  let sqlCommand = `SELECT * FROM roles WHERE title = ?`;
                  dbConnection.query(sqlCommand, newRole, (error, results) => {
                    if (error) {
                      console.log(error);
                    } else {
                      let newRoleId = results[0].id;

                      let sqlCommand = `
                        UPDATE employees
                        SET role_id = ?
                        WHERE CONCAT(id, " ", first_name, + " ", last_name) = ?`;

                      let updatedEmployee = [newRoleId, employeeName];
                      dbConnection.query(
                        sqlCommand,
                        updatedEmployee,
                        (error, results) => {
                          if (error) {
                            console.log(error);
                          } else {
                            console.log(
                              `\nYou have updated ${employeeName}'s role to ${newRoleId}. \n`
                            );
                            startPrompt();
                          }
                        }
                      );
                    }
                  });
                });
            }
          });
        });
    }
  });
}

function showAllDepartments() {
  console.log("Here are all the Departments I have:\n");

  let query = `
        SELECT name as "Department",
        id as "Department ID"
        FROM departments
        ;`;

  dbConnection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    startPrompt();
  });
}

function showAllRoles() {
  let sqlCommand = `SELECT roles.title AS "Job Title",
    roles.id AS "Job ID",
    dept.name AS "Department",
    roles.salary AS "Salary"
    FROM roles
    JOIN departments dept
    ON roles.department_id=dept.id;`;
  dbConnection.query(sqlCommand, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      console.table("\n Here are all the roles in the company:", results);
      startPrompt();
    }

    console.table(res);
    startPrompt();
  });
}

function addNewRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newRole",
        message: "what is the name of the new role you are adding?",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "How much does this Role make in salary?",
      },
    ])
    .then(function (results) {
      let newRole = [results.newRole, results.roleSalary];

      let sqlCommand = `SELECT * FROM departments`;

      dbConnection.query(sqlCommand, function (error, results) {
        if (error) {
          console.log(error);
        } else {
          let departments = results.map(({ id, name }) => ({
            name: name,
            value: id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "departments",
                mesasage: "What department will this role be apart of?",
                choices: departments,
              },
            ])
            .then(function (results) {
              let dept = results.departments;
              newRole.push(dept);

              let sqlCommand = `INSERT INTO roles (title, salary, department_id)
              VALUES (?, ?, ?)`;
              dbConnection.query(sqlCommand, newRole, (error) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log(`\n Added new role named ${newRole[0]} \n`);
                }
              });
            });
        }
      });
    });
}

function showAllDepartments() {
  console.log("Here are all the Departments I have:\n");

  let sqlCommand = `
        SELECT name AS "Department",
        id AS "Department ID"
        FROM departments
        ;`;

  dbConnection.query(sqlCommand, function (error, results) {
    if (error) {
      console.log(error);
    } else {
      console.log("\n Here are all of the departments. \n");
      console.table(results);
      startPrompt();
    }
  });
}

function addNewDepartment() {
  inquirer
    .prompt([
      {
        name: "newDepartment",
        type: "input",
        message: "What would you like to name this new department?",
      },
    ])
    .then(function (newDepartmentName) {
      let newDepartment = newDepartmentName.newDepartment;

      let sqlCommand = `INSERT INTO departments (name) VALUES (?)`;
      dbConnection.query(sqlCommand, newDepartment, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(
            `\n You have added a new department called ${newDepartment}, \n`
          );
          startPrompt();
        }
      });
    });
}
