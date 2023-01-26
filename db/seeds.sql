USE company_db;

INSERT INTO departments (name)
VALUES  ('Warehouse Worker'), 
        ('Leader'),
        ('Managment');

INSERT INTO roles (department_id, title, salary)
VALUES  (1,'Team Member', 50000),
        (2,'Team Lead', 85000),
        (3,'Operations Manager', 120000);
        

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ('Master', 'Chief', 3, NULL),
        ('Gerlt', 'of Rivia', 2, 1),
        ('Author', 'Morgan', 2, 1),
        ('Doom', 'Guy', 1, 2),
        ('Bill', 'Williamson', 1, 2),
        ('John', 'Marstin', 1, 2),
        ('Kazuha', 'Kaedehara', 1, 3),
        ('Scaramouche', 'Balladeer', 1, 3),
        ('Dutch', 'Vanderlinde', 1, 3);






        
