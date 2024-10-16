-- Insert data into `customer`
INSERT INTO customer (customer_id, type, contact_number, hashed_password, email, address)
VALUES 
(1, 'individual', '1234567890', 'hashed_password_1', 'john.doe@example.com', '123 Main St'),
(2, 'organization', '2345678901', 'hashed_password_2', 'company1@example.com', '456 Industry Rd'),
(3, 'individual', '3456789012', 'hashed_password_3', 'jane.smith@example.com', '789 Oak Dr'),
(4, 'organization', '4567890123', 'hashed_password_4', 'company2@example.com', '101 Pine Ln'),
(5, 'individual', '5678901234', 'hashed_password_5', 'alice.johnson@example.com', '202 Elm St'),
(6, 'organization', '6789012345', 'hashed_password_6', 'company3@example.com', '303 Maple Ave'),
(7, 'individual', '7890123456', 'hashed_password_7', 'bob.brown@example.com', '404 Cedar Rd'),
(8, 'organization', '8901234567', 'hashed_password_8', 'company4@example.com', '505 Birch St'),
(9, 'individual', '9012345678', 'hashed_password_9', 'charlie.davis@example.com', '606 Walnut St'),
(10, 'organization', '0123456789', 'hashed_password_10', 'company5@example.com', '707 Willow Way');

-- Insert data into `organization_customer`
INSERT INTO organization_customer (customer_id, name, registration_no, contact_person, contact_person_position)
VALUES 
(2, 'Tech Solutions', 'REG001', 'John Doe', 'CEO'),
(4, 'Green Energy Co.', 'REG002', 'Jane Doe', 'Director'),
(6, 'AutoMotive Ltd.', 'REG003', 'Sam Smith', 'Manager'),
(8, 'Foodies Inc.', 'REG004', 'Bob White', 'Executive'),
(10, 'HealthCare Ltd.', 'REG005', 'Alice Black', 'HR');

-- Insert data into `individual_customer`
INSERT INTO individual_customer (customer_id, first_name, last_name, date_of_birth, nic, image_path)
VALUES 
(1, 'John', 'Doe', '1990-01-01', 'NIC001', '/images/john.jpg'),
(3, 'Jane', 'Smith', '1985-05-15', 'NIC002', '/images/jane.jpg'),
(5, 'Alice', 'Johnson', '1992-03-20', 'NIC003', '/images/alice.jpg'),
(7, 'Bob', 'Brown', '1988-07-30', 'NIC004', '/images/bob.jpg'),
(9, 'Charlie', 'Davis', '1995-11-25', 'NIC005', '/images/charlie.jpg');

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
(3, 3, 3, 'saving', 2000.00, '2023-03-01', 'blocked'),
(4, 4, 4, 'checking', 8000.00, '2023-04-01', 'deactivated'),
(5, 5, 5, 'saving', 3000.00, '2023-05-01', 'expired'),
(6, 6, 1, 'checking', 6000.00, '2023-06-01', 'active'),
(7, 7, 2, 'saving', 4000.00, '2023-07-01', 'active'),
(8, 8, 3, 'checking', 7000.00, '2023-08-01', 'blocked'),
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
