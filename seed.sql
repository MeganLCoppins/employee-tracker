use employees;

INSERT INTO department (department_name)
VALUES ("IT"),
        ("Finance"),
        ("Human Resources"),
        ("Sales");

INSERT INTO employee_role (title, salary, department_id)
VALUES ("Senior Developer", 70000, 1),
        ("IT Manager", 80000, 1),
        ("Accountant", 50000, 2),
        ("Finance Manager", 60000, 2),
        ("HR Rep", 45000, 3),
        ("HR Manager", 50000, 3),
        ("Sales Rep", 50000, 4),
        ("Sales Manager", 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Phyllis", "Smith", 1, 2),
        ("Stanley", "Hudson", 2, NULL),
        ("Kevin", "Malone", 3, 4),
        ("Angela", "Martin", 4, NULL),
        ("Ryan", "Howard", 5, 6),
        ("Kelly", "Kapoor", 6, NULL),
        ("Jim", "Halpert", 7, 8),
        ("Michael", "Scott", 8, NULL);