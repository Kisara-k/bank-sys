CREATE DATABASE `boc`; 
USE `boc`;

SET NAMES utf8;
SET character_set_client = utf8mb4;

CREATE TABLE `customer` (
  `customer_id` INT(5) UNSIGNED NOT NULL PRIMARY KEY,
  `type` ENUM('individual', 'organization') NOT NULL,
  `contact_number` CHAR(10) NOT NULL,
  `hashed_password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(50) NOT NULL UNIQUE,
  `address` VARCHAR(255) NOT NULL,
  CHECK(contact_number REGEXP '^[0-9]{10}$')
);

CREATE TABLE `organization_customer` (
  `customer_id` INT UNSIGNED NOT NULL PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `registration_no` VARCHAR(20) NOT NULL UNIQUE,
  `contact_person` VARCHAR(50) NOT NULL,
  `contact_person_position` VARCHAR(20) NOT NULL,
  FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE `individual_customer` (
  `customer_id` INT UNSIGNED NOT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `date_of_birth` DATE NOT NULL, 
  `nic` VARCHAR(12) NOT NULL UNIQUE,
  `image_path` VARCHAR(255),
  PRIMARY KEY (`customer_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE `branches` (
  `branch_id` INT UNSIGNED NOT NULL PRIMARY KEY,
  `city` VARCHAR(50) NOT NULL,
  `address` VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE `employees` (
  `employee_id` INT UNSIGNED NOT NULL PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `role` ENUM('employee', 'manager') NOT NULL,
  `branch_id` INT UNSIGNED NOT NULL,
  `hashed_password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `address` VARCHAR(255) NOT NULL,
  `contact_number` CHAR(10) NOT NULL,
  FOREIGN KEY (`branch_id`) REFERENCES `branches`(`branch_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  CHECK(contact_number REGEXP '^[0-9]{10}$')
);

CREATE TABLE `account` (
  `account_id` INT UNSIGNED NOT NULL PRIMARY KEY,
  `customer_id` INT UNSIGNED NOT NULL,
  `branch_id` INT UNSIGNED NOT NULL,
  `type` ENUM('saving', 'checking') NOT NULL,
  `balance` NUMERIC(15,2) NOT NULL,
  `start_date` DATE NOT NULL,
  `status` ENUM('active', 'deactivate', 'block', 'expired') NOT NULL,
  FOREIGN KEY (`branch_id`) REFERENCES `branches`(`branch_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE `saving_account_plans` (
  `plan_id` TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  `plan_name` VARCHAR(20) NOT NULL,
  `interest_rate` NUMERIC(4,2) NOT NULL,
  `min_balance` INT UNSIGNED NOT NULL,
  `max_monthly_withdraw` SMALLINT UNSIGNED NOT NULL
);

CREATE TABLE `saving_account` (
  `account_id` INT UNSIGNED NOT NULL PRIMARY KEY,
  `monthly_withdrawals` INT UNSIGNED NOT NULL,
  `plan_id` TINYINT UNSIGNED NOT NULL,
  `balance` NUMERIC(15,2) NOT NULL,
  `start_date` DATE NOT NULL,
  FOREIGN KEY (`account_id`) REFERENCES `account`(`account_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  FOREIGN KEY (`plan_id`) REFERENCES `saving_account_plans`(`plan_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE `checking_account` (
  `account_id` INT UNSIGNED NOT NULL PRIMARY KEY,
  `start_date` DATE NOT NULL,
  `balance` NUMERIC(15,2) NOT NULL
);

CREATE TABLE `loans` (
  `loan_id` INT UNSIGNED NOT NULL PRIMARY KEY,
  `amount` NUMERIC(15,2) NOT NULL,
  `account_id` INT UNSIGNED NOT NULL,
  `rate` NUMERIC(4,2) NOT NULL,
  `monthly_installment` INT UNSIGNED NOT NULL,
  `duration_months` INT UNSIGNED NOT NULL,
  `start_date` DATE NOT NULL,
  `type` ENUM('physical', 'online') NOT NULL,
  `status` ENUM('pending', 'overdue', 'paid') NOT NULL,
  FOREIGN KEY (`account_id`) REFERENCES `account`(`account_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE `transaction_log` (
  `transaction_id` INT UNSIGNED NOT NULL PRIMARY KEY,
  `account_id` INT UNSIGNED NOT NULL,
  `date` TIMESTAMP NOT NULL,
  `amount` NUMERIC(15,2) NOT NULL,
  `type` ENUM('withdrawal', 'deposit','transfer') NOT NULL,
  FOREIGN KEY (`account_id`) REFERENCES `account`(`account_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE `intra_bank_transfer_log` (
  `transaction_id` INT UNSIGNED NOT NULL PRIMARY KEY,
  `receive_transaction_id` INT UNSIGNED NOT NULL,
  FOREIGN KEY (`transaction_id`) REFERENCES `transaction_log`(`transaction_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  FOREIGN KEY (`receive_transaction_id`) REFERENCES `account`(`account_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE `physical_loan` (
  `loan_id` INT UNSIGNED NOT NULL PRIMARY KEY,
  `account_id` INT UNSIGNED NOT NULL,
  `approved_by` INT UNSIGNED NOT NULL,
  FOREIGN KEY (`loan_id`) REFERENCES `loans`(`loan_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  FOREIGN KEY (`approved_by`) REFERENCES `employees`(`employee_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE `fd_plans` (
  `plan_id` TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  `duration_months` SMALLINT UNSIGNED NOT NULL,
  `rate` NUMERIC(4,2) NOT NULL
);

CREATE TABLE `fixed_deposit` (
  `fd_id` INT UNSIGNED NOT NULL PRIMARY KEY,
  `account_id` INT UNSIGNED NOT NULL,
  `plan_id` TINYINT UNSIGNED NOT NULL,
  `start_date` DATE NOT NULL,
  `amount` NUMERIC(15,2) NOT NULL,
  FOREIGN KEY (`account_id`) REFERENCES `saving_account`(`account_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  FOREIGN KEY (`plan_id`) REFERENCES `fd_plans`(`plan_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE `account_status_log` (
  `account_id` INT UNSIGNED NOT NULL,
  `action_id` INT UNSIGNED NOT NULL,
  `set_status_action` VARCHAR(10) NOT NULL,
  `date` TIMESTAMP NOT NULL,
  PRIMARY KEY (`action_id`, `account_id`),
  FOREIGN KEY (`account_id`) REFERENCES `account`(`account_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE `loan_installment_log` (
  `loan_id` INT UNSIGNED NOT NULL,
  `installment_id` INT UNSIGNED NOT NULL,
  `due_date` DATE NOT NULL,
  `amount` NUMERIC(15,2) NOT NULL,
  `payment_date` TIMESTAMP,
  `status` ENUM('pending', 'overdue', 'paid','approved') NOT NULL,
  PRIMARY KEY (`loan_id`, `installment_id`),
  FOREIGN KEY (`loan_id`) REFERENCES `loans`(`loan_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);
-- Insert data into `customer`
INSERT INTO customer (customer_id, type, contact_number, hashed_password, email, address)
VALUES 
(10015, 'individual', '2482511234', '2a1d60f1fa7e3f3f', 'sophie.dumas@gmail.com', '15 Beau Vallon Rd, Victoria'),
    (10025, 'organization', '2483573421', '3d67a2b5f983a1a4', 'maritim.resorts@gmail.com', 'Pointe Larue, Mahe'),
    (10047, 'individual', '2482345678', '4b29c3e6f1b2d4c5', 'liam.johansen@gmail.com', 'Anse Lazio Beach, Praslin'),
    (10062, 'individual', '2482234591', '5c82d4a7f3b1e2d5', 'nina.fernandez@gmail.com', '9 Anse Royale Ave, Mahe'),
    (10073, 'organization', '2482456723', '7e4b3a9f5d2c1e3f', 'ocean.villas@gmail.com', 'La Digue Island Lodge, La Digue'),
    (10088, 'individual', '2482893214', '6d5c4f3a1b2d7e6f', 'lucas.moreau@gmail.com', '1 Eden Island Dr, Mahe'),
    (10105, 'individual', '2482534782', '3c7e5f4d1a2b6d8e', 'zoe.mendes@gmail.com', '15 Glacis Heights, Mahe'),
    (10112, 'organization', '2482689753', '9f8b6d4a3e2c1d7f', 'reef.hotels@gmail.com', 'Grand Anse, Praslin'),
    (10128, 'individual', '2482654321', '4d2c7e9f1a3b5d6e', 'mario.santini@gmail.com', 'Port Glaud, Mahe'),
    (10139, 'organization', '2482786435', '5e7f3a9c4b2d1a6f', 'seybrew.company@gmail.com', '5 Brewery Rd, Victoria');

-- Insert data into `organization_customer`
INSERT INTO organization_customer (customer_id, name, registration_no, contact_person, contact_person_position)
VALUES 
(10025, 'Tech Solutions', 'REG001', 'John Doe', 'CEO'),
    (10073, 'Green Energy Co.', 'REG002', 'Jane Doe', 'Director'),
    (10112, 'AutoMotive Ltd.', 'REG003', 'Sam Smith', 'Manager'),
    (10139, 'Foodies Inc.', 'REG004', 'Bob White', 'Executive'),
    (10128, 'HealthCare Ltd.', 'REG005', 'Alice Black', 'HR');

-- Insert data into `individual_customer`
INSERT INTO individual_customer (customer_id, first_name, last_name, date_of_birth, nic, image_path)
VALUES 
(10015, 'John', 'Doe', '1990-01-01', 'NIC001', '/images/john.jpg'),
    (10047, 'Jane', 'Smith', '1985-05-15', 'NIC002', '/images/jane.jpg'),
    (10088, 'Alice', 'Johnson', '1992-03-20', 'NIC003', '/images/alice.jpg'),
    (10105, 'Bob', 'Brown', '1988-07-30', 'NIC004', '/images/bob.jpg'),
    (10128, 'Charlie', 'Davis', '1995-11-25', 'NIC005', '/images/charlie.jpg');
-- Insert data into `branches`
INSERT INTO branches (branch_id, city, address)
VALUES 
(1, 'New York', '100 Broadway St'),
(2, 'Los Angeles', '200 Sunset Blvd'),
(3, 'Chicago', '300 Lakeshore Dr'),
(4, 'Houston', '400 Space St'),
(5, 'Phoenix', '500 Desert Rd');

-- Insert data into `employees`
INSERT INTO employees (employee_id, name, role, branch_id, hashed_password, email, address, contact_number)
VALUES 
(1, 'Employee One', 'employee', 1, 'hashed_password_11', 'emp1@example.com', '1010 Employee St', '1231231234'),
(2, 'Employee Two', 'manager', 2, 'hashed_password_12', 'emp2@example.com', '2020 Manager Ln', '2342342345'),
(3, 'Employee Three', 'employee', 3, 'hashed_password_13', 'emp3@example.com', '3030 Worker Rd', '3453453456'),
(4, 'Employee Four', 'manager', 4, 'hashed_password_14', 'emp4@example.com', '4040 Leader St', '4564564567'),
(5, 'Employee Five', 'employee', 5, 'hashed_password_15', 'emp5@example.com', '5050 Boss Ln', '5675675678');

-- Insert data into `account`
INSERT INTO account (account_id, customer_id, branch_id, type, balance, start_date, status)
VALUES 
(1, 1, 1, 'saving', 1000.00, '2023-01-01', 'active'),
(2, 2, 2, 'checking', 5000.00, '2023-02-01', 'active'),
(3, 3, 3, 'saving', 2000.00, '2023-03-01', 'block'),
(4, 4, 4, 'checking', 8000.00, '2023-04-01', 'deactivate'),
(5, 5, 5, 'saving', 3000.00, '2023-05-01', 'expired'),
(6, 6, 1, 'checking', 6000.00, '2023-06-01', 'active'),
(7, 7, 2, 'saving', 4000.00, '2023-07-01', 'active'),
(8, 8, 3, 'checking', 7000.00, '2023-08-01', 'block'),
(9, 9, 4, 'saving', 9000.00, '2023-09-01', 'active'),
(10, 10, 5, 'checking', 10000.00, '2023-10-01', 'active');

-- Insert data into `saving_account_plans`
INSERT INTO saving_account_plans (plan_id, plan_name, interest_rate, min_balance, max_monthly_withdraw)
VALUES 
(1, 'Basic Plan', 1.50, 1000, 5),
(2, 'Premium Plan', 2.00, 5000, 10);

-- Insert data into `saving_account`
INSERT INTO saving_account (account_id, monthly_withdrawals, plan_id, balance, start_date)
VALUES 
(1, 2, 1, 1000.00, '2023-01-01'),
(3, 1, 1, 2000.00, '2023-03-01'),
(5, 4, 2, 3000.00, '2023-05-01'),
(7, 3, 1, 4000.00, '2023-07-01'),
(9, 0, 2, 9000.00, '2023-09-01');

-- Insert data into `checking_account`
INSERT INTO checking_account (account_id, start_date, balance)
VALUES 
(2, '2023-02-01', 5000.00),
(4, '2023-04-01', 8000.00),
(6, '2023-06-01', 6000.00),
(8, '2023-08-01', 7000.00),
(10, '2023-10-01', 10000.00);

-- Insert data into `loans`
INSERT INTO loans (loan_id, amount, account_id, rate, monthly_installment, duration_months, start_date, type, status)
VALUES 
(1, 10000.00, 1, 3.50, 500, 24, '2023-01-01', 'physical', 'pending'),
(2, 5000.00, 2, 2.00, 300, 12, '2023-02-01', 'online', 'overdue'),
(3, 15000.00, 3, 4.00, 700, 36, '2023-03-01', 'physical', 'paid'),
(4, 2000.00, 4, 1.50, 100, 6, '2023-04-01', 'online', 'pending'),
(5, 12000.00, 5, 3.00, 600, 18, '2023-05-01', 'physical', 'overdue');

-- Insert data into `transaction_log`
INSERT INTO transaction_log (transaction_id, account_id, date, amount, type)
VALUES 
(1, 1, '2023-01-01 10:00:00', 500.00, 'deposit'),
(2, 2, '2023-02-01 11:00:00', 1000.00, 'withdrawal'),
(3, 3, '2023-03-01 12:00:00', 1500.00, 'deposit'),
(4, 4, '2023-04-01 13:00:00', 2000.00, 'withdrawal'),
(5, 5, '2023-05-01 14:00:00', 2500.00, 'transfer');

-- Insert data into `intra_bank_transfer_log`
INSERT INTO intra_bank_transfer_log (transaction_id, receive_transaction_id)
VALUES 
(5, 2);

-- Insert data into `physical_loan`
INSERT INTO physical_loan (loan_id, account_id, approved_by)
VALUES 
(1, 1, 1),
(3, 3, 2),
(5, 5, 3);

-- Insert data into `fd_plans`
INSERT INTO fd_plans (plan_id, duration_months, rate)
VALUES 
(1, 12, 2.50),
(2, 24, 3.00),
(3, 36, 3.50);

-- Insert data into `fixed_deposit`
INSERT INTO fixed_deposit (fd_id, account_id, plan_id, start_date, amount)
VALUES 
(1, 1, 1, '2023-01-01', 5000.00),
(2, 3, 2, '2023-03-01', 10000.00),
(3, 5, 3, '2023-05-01', 15000.00),
(4, 7, 1, '2023-07-01', 20000.00),
(5, 9, 2, '2023-09-01', 25000.00);

-- Insert data into `account_status_log`
INSERT INTO account_status_log (account_id, action_id, set_status_action, date)
VALUES 
(1, 1, 'active', '2023-01-01 10:00:00'),
(2, 2, 'active', '2023-02-01 11:00:00'),
(3, 3, 'block', '2023-03-01 12:00:00'),
(4, 4, 'deactivate', '2023-04-01 13:00:00'),
(5, 5, 'expired', '2023-05-01 14:00:00');

-- Insert data into `loan_installment_log`
INSERT INTO loan_installment_log (loan_id, installment_id, due_date, amount, payment_date, status)
VALUES 
(1, 1, '2023-02-01', 500.00, '2023-02-01 10:00:00', 'paid'),
(1, 2, '2023-03-01', 500.00, '2023-03-01 10:00:00', 'paid'),
(2, 1, '2023-03-01', 300.00, NULL, 'overdue'),
(3, 1, '2023-04-01', 700.00, '2023-04-01 11:00:00', 'paid'),
(4, 1, '2023-05-01', 100.00, '2023-05-01 12:00:00', 'paid');
