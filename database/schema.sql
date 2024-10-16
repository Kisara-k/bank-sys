CREATE DATABASE `bank`; 
USE `bank`;

SET NAMES utf8mb4;
SET character_set_client = utf8mb4;

CREATE TABLE `customer` (
  `customer_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `type` ENUM('individual', 'organization') NOT NULL,
  `contact_number` CHAR(10) NOT NULL,
  `hashed_password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(50) NOT NULL UNIQUE,
  `address` VARCHAR(255) NOT NULL,
  CHECK (contact_number REGEXP '^[0-9]{10}$')
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
  `customer_id` INT UNSIGNED NOT NULL PRIMARY KEY,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `date_of_birth` DATE NOT NULL, 
  `nic` VARCHAR(12) NOT NULL UNIQUE,
  `image_path` VARCHAR(255),
  FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE `branches` (
  `branch_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `city` VARCHAR(50) NOT NULL,
  `address` VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE `employees` (
  `employee_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
  CHECK (contact_number REGEXP '^[0-9]{10}$')
);

CREATE TABLE `account` (
  `account_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT UNSIGNED NOT NULL,
  `branch_id` INT UNSIGNED NOT NULL,
  `type` ENUM('saving', 'checking') NOT NULL,
  `balance` NUMERIC(15,2) NOT NULL,
  `start_date` DATE NOT NULL,
  `status` ENUM('active', 'deactivated', 'blocked', 'expired') NOT NULL,
  FOREIGN KEY (`branch_id`) REFERENCES `branches`(`branch_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE `saving_account_plans` (
  `plan_id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
  `loan_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
  `transaction_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `account_id` INT UNSIGNED NOT NULL,
  `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` NUMERIC(15,2) NOT NULL,
  `type` ENUM('withdrawal', 'deposit', 'transfer') NOT NULL,
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
  FOREIGN KEY (`receive_transaction_id`) REFERENCES `transaction_log`(`transaction_id`)
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
  `plan_id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `duration_months` SMALLINT UNSIGNED NOT NULL,
  `rate` NUMERIC(4,2) NOT NULL
);

CREATE TABLE `fixed_deposit` (
  `fd_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
  `action_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `set_status_action` ENUM('active', 'deactivated', 'blocked', 'expired') NOT NULL,
  `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`action_id`, `account_id`),
  FOREIGN KEY (`account_id`) REFERENCES `account`(`account_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE `loan_installment_log` (
  `loan_id` INT UNSIGNED NOT NULL,
  `installment_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `due_date` DATE NOT NULL,
  `amount` NUMERIC(15,2) NOT NULL,
  `payment_date` TIMESTAMP,
  `status` ENUM('pending', 'overdue', 'paid') NOT NULL,
  PRIMARY KEY (`loan_id`, `installment_id`),
  FOREIGN KEY (`loan_id`) REFERENCES `loans`(`loan_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);
