DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE departments (
   id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
   name VARCHAR(30)
);

CREATE TABLE roles (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(12,2),
    department_id INT NOT NULL, 
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);



