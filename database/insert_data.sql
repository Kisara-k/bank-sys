-- Insert data into `customer`
INSERT INTO customer (customer_id, type, contact_number, hashed_password, email, address)
VALUES 
(100001, 'individual', '2482511234', '2a1d60f1fa7e3f3', 'sophie.dumas@gmail.com', '15 Beau Vallon Rd, Victoria, Seychelles'),
(100002, 'organization', '2482525678', '9f5e96c1e64afcd', 'info@bluewaveco.com', '21 Coral Beach Rd, Anse Royale, Seychelles'),
(100003, 'individual', '2482536789', 'b9e25ac87223cb7', 'pierre.ravelo@yahoo.com', '32 Green Hill St, La Digue, Seychelles'),
(100004, 'organization', '2482547890', '4cd457e9e5c9a87', 'contact@globetechinc.com', '45 Banyan Ave, Mont Fleuri, Seychelles'),
(100005, 'individual', '2482558901', 'e5a827fed9cbdf1', 'liam.leclerc@yahoo.com', '67 Sunset Blvd, Praslin, Seychelles'),
(100006, 'organization', '2482569012', '7f38e634d19bf8b', 'admin@greentech.org', '12 Coconut Grove, Glacis, Seychelles'),
(100007, 'individual', '2482570123', 'b2a6b5a3b9e8d7f', 'malaika.ngema@gmail.com', '89 Ocean View Rd, Victoria, Seychelles'),
(100008, 'organization', '2482581234', '8d1c6f5a2a3e789', 'sales@islandfoods.co', '99 Palm Beach Rd, Anse Boileau, Seychelles'),
(100009, 'individual', '2482592345', '9ac8273f2a6d5c1', 'ethan.davies@gmail.com', '101 Palm Ridge Rd, La Digue, Seychelles'),
(100010, 'organization', '2482603456', '4eb7b6e84f5cd93', 'support@healthfirst.com', '111 Reef Way, Anse Etoile, Seychelles');


-- Insert data into `organization_customer`
INSERT INTO organization_customer (customer_id, name, registration_no, contact_person, contact_person_position)
VALUES 
(100002, 'Blue Wave Co.', 'REG567', 'Catherine Morin', 'CEO'),
(100004, 'GlobeTech Inc.', 'REG789', 'David Kimani', 'Director'),
(100006, 'GreenTech Org.', 'REG012', 'Naledi Chisulo', 'Operations Manager'),
(100008, 'Island Foods Ltd.', 'REG345', 'Fatima Musonda', 'Chief Executive'),
(100010, 'HealthFirst Ltd.', 'REG678', 'George Aubrey', 'HR Head');

-- Insert data into `individual_customer`
INSERT INTO individual_customer (customer_id, first_name, last_name, date_of_birth, nic, image_path)
VALUES 
(100001, 'Sophie', 'Dumas', '1991-04-10', 'DUMSY041091', '/images/sophie.jpg'),
(100003, 'Pierre', 'Ravelo', '1984-08-22', 'RAVPE082284', '/images/pierre.jpg'),
(100005, 'Liam', 'Leclerc', '1990-02-17', 'LECLL021790', '/images/liam.jpg'),
(100007, 'Malaika', 'Ngema', '1987-09-15', 'NGEMM091587', '/images/malaika.jpg'),
(100009, 'Ethan', 'Davies', '1995-12-02', 'DAVIE120295', '/images/ethan.jpg');

-- Insert data into `branches`
INSERT INTO branches (branch_id, city, address)
VALUES 
(1, 'Victoria', '14 Independence Ave, Victoria, Seychelles'),
(2, 'Praslin', '22 Grand Anse Rd, Praslin, Seychelles'),
(3, 'Mahe', '55 Eden Island, Mahe, Seychelles'),
(4, 'La Digue', '34 Port Launay, La Digue, Seychelles'),
(5, 'Dubai', '123 Sheikh Zayed Rd, Dubai, UAE');

INSERT INTO employees (employee_id, name, role, branch_id, hashed_password, email, address, contact_number)
VALUES 
-- Managers
(101, 'Emile Dubois', 'manager', 1, 'bf4a9f67e37e892', 'emile.dubois@seybank.com', '1010 Beau Vallon St', '+248 2512345'),
(102, 'Clara Fournier', 'manager', 2, 'cde42e89b1a64fc', 'clara.fournier@seybank.com', '2020 Victoria Ave', '+248 2523456'),
(103, 'Paul Roche', 'manager', 3, 'd1e29b3c6f8f4ea', 'paul.roche@seybank.com', '3030 La Digue Rd', '+248 2534567'),
(104, 'Nadia Marcel', 'manager', 4, 'e37cbf1a249fe3a', 'nadia.marcel@seybank.com', '4040 Praslin St', '+248 2545678'),
(105, 'Pierre Valois', 'manager', 5, 'f1c93e56b479ef1', 'pierre.valois@seybank.com', '5050 Mahe Lane', '+248 2556789'),

-- Employees for Branch 1
(106, 'Alice Martin', 'employee', 1, 'a1b2c3d4e5f6g7h8', 'alice.martin@seybank.com', '1011 Beau Vallon St', '+248 2512346'),
(107, 'Bob Dupont', 'employee', 1, 'b2c3d4e5f6g7h8i9', 'bob.dupont@seybank.com', '1012 Beau Vallon St', '+248 2512347'),
(108, 'Charlie Durand', 'employee', 1, 'c3d4e5f6g7h8i9j0', 'charlie.durand@seybank.com', '1013 Beau Vallon St', '+248 2512348'),
(109, 'David Moreau', 'employee', 1, 'd4e5f6g7h8i9j0k1', 'david.moreau@seybank.com', '1014 Beau Vallon St', '+248 2512349'),
(110, 'Eve Lefevre', 'employee', 1, 'e5f6g7h8i9j0k1l2', 'eve.lefevre@seybank.com', '1015 Beau Vallon St', '+248 2512350'),
(111, 'Frank Lambert', 'employee', 1, 'f6g7h8i9j0k1l2m3', 'frank.lambert@seybank.com', '1016 Beau Vallon St', '+248 2512351'),
(112, 'Grace Simon', 'employee', 1, 'g7h8i9j0k1l2m3n4', 'grace.simon@seybank.com', '1017 Beau Vallon St', '+248 2512352'),
(113, 'Hank Bernard', 'employee', 1, 'h8i9j0k1l2m3n4o5', 'hank.bernard@seybank.com', '1018 Beau Vallon St', '+248 2512353'),
(114, 'Ivy Girard', 'employee', 1, 'i9j0k1l2m3n4o5p6', 'ivy.girard@seybank.com', '1019 Beau Vallon St', '+248 2512354'),
(115, 'Jack Lefevre', 'employee', 1, 'j0k1l2m3n4o5p6q7', 'jack.lefevre@seybank.com', '1020 Beau Vallon St', '+248 2512355'),

-- Employees for Branch 2
(116, 'Karen Dubois', 'employee', 2, 'k1l2m3n4o5p6q7r8', 'karen.dubois@seybank.com', '2021 Victoria Ave', '+248 2523457'),
(117, 'Leo Fournier', 'employee', 2, 'l2m3n4o5p6q7r8s9', 'leo.fournier@seybank.com', '2022 Victoria Ave', '+248 2523458'),
(118, 'Mia Roche', 'employee', 2, 'm3n4o5p6q7r8s9t0', 'mia.roche@seybank.com', '2023 Victoria Ave', '+248 2523459'),
(119, 'Nina Marcel', 'employee', 2, 'n4o5p6q7r8s9t0u1', 'nina.marcel@seybank.com', '2024 Victoria Ave', '+248 2523460'),
(120, 'Oscar Valois', 'employee', 2, 'o5p6q7r8s9t0u1v2', 'oscar.valois@seybank.com', '2025 Victoria Ave', '+248 2523461'),
(121, 'Pauline Martin', 'employee', 2, 'p6q7r8s9t0u1v2w3', 'pauline.martin@seybank.com', '2026 Victoria Ave', '+248 2523462'),
(122, 'Quentin Dupont', 'employee', 2, 'q7r8s9t0u1v2w3x4', 'quentin.dupont@seybank.com', '2027 Victoria Ave', '+248 2523463'),
(123, 'Rachel Durand', 'employee', 2, 'r8s9t0u1v2w3x4y5', 'rachel.durand@seybank.com', '2028 Victoria Ave', '+248 2523464'),
(124, 'Steve Moreau', 'employee', 2, 's9t0u1v2w3x4y5z6', 'steve.moreau@seybank.com', '2029 Victoria Ave', '+248 2523465'),
(125, 'Tina Lefevre', 'employee', 2, 't0u1v2w3x4y5z6a7', 'tina.lefevre@seybank.com', '2030 Victoria Ave', '+248 2523466'),

-- Employees for Branch 3
(126, 'Ursula Lambert', 'employee', 3, 'u1v2w3x4y5z6a7b8', 'ursula.lambert@seybank.com', '3031 La Digue Rd', '+248 2534568'),
(127, 'Victor Simon', 'employee', 3, 'v2w3x4y5z6a7b8c9', 'victor.simon@seybank.com', '3032 La Digue Rd', '+248 2534569'),
(128, 'Wendy Bernard', 'employee', 3, 'w3x4y5z6a7b8c9d0', 'wendy.bernard@seybank.com', '3033 La Digue Rd', '+248 2534570'),
(129, 'Xavier Girard', 'employee', 3, 'x4y5z6a7b8c9d0e1', 'xavier.girard@seybank.com', '3034 La Digue Rd', '+248 2534571'),
(130, 'Yvonne Lefevre', 'employee', 3, 'y5z6a7b8c9d0e1f2', 'yvonne.lefevre@seybank.com', '3035 La Digue Rd', '+248 2534572'),
(131, 'Zach Martin', 'employee', 3, 'z6a7b8c9d0e1f2g3', 'zach.martin@seybank.com', '3036 La Digue Rd', '+248 2534573'),
(132, 'Amy Dubois', 'employee', 3, 'a7b8c9d0e1f2g3h4', 'amy.dubois@seybank.com', '3037 La Digue Rd', '+248 2534574'),
(133, 'Brian Fournier', 'employee', 3, 'b8c9d0e1f2g3h4i5', 'brian.fournier@seybank.com', '3038 La Digue Rd', '+248 2534575'),
(134, 'Cathy Roche', 'employee', 3, 'c9d0e1f2g3h4i5j6', 'cathy.roche@seybank.com', '3039 La Digue Rd', '+248 2534576'),
(135, 'Daniel Marcel', 'employee', 3, 'd0e1f2g3h4i5j6k7', 'daniel.marcel@seybank.com', '3040 La Digue Rd', '+248 2534577'),

-- Employees for Branch 4
(136, 'Evelyn Valois', 'employee', 4, 'e1f2g3h4i5j6k7l8', 'evelyn.valois@seybank.com', '4041 Praslin St', '+248 2545679'),
(137, 'Felix Martin', 'employee', 4, 'f2g3h4i5j6k7l8m9', 'felix.martin@seybank.com', '4042 Praslin St', '+248 2545680'),
(138, 'Gloria Dupont', 'employee', 4, 'g3h4i5j6k7l8m9n0', 'gloria.dupont@seybank.com', '4043 Praslin St', '+248 2545681'),
(139, 'Henry Durand', 'employee', 4, 'h4i5j6k7l8m9n0o1', 'henry.durand@seybank.com', '4044 Praslin St', '+248 2545682'),
(140, 'Iris Moreau', 'employee', 4, 'i5j6k7l8m9n0o1p2', 'iris.moreau@seybank.com', '4045 Praslin St', '+248 2545683'),
(141, 'Jackie Lefevre', 'employee', 4, 'j6k7l8m9n0o1p2q3', 'jackie.lefevre@seybank.com', '4046 Praslin St', '+248 2545684'),
(142, 'Kevin Lambert', 'employee', 4, 'k7l8m9n0o1p2q3r4', 'kevin.lambert@seybank.com', '4047 Praslin St', '+248 2545685'),
(143, 'Lily Simon', 'employee', 4, 'l8m9n0o1p2q3r4s5', 'lily.simon@seybank.com', '4048 Praslin St', '+248 2545686'),
(144, 'Mike Bernard', 'employee', 4, 'm9n0o1p2q3r4s5t6', 'mike.bernard@seybank.com', '4049 Praslin St', '+248 2545687'),
(145, 'Nora Girard', 'employee', 4, 'n0o1p2q3r4s5t6u7', 'nora.girard@seybank.com', '4050 Praslin St', '+248 2545688'),

-- Employees for Branch 5
(146, 'Oscar Lefevre', 'employee', 5, 'o1p2q3r4s5t6u7v8', 'oscar.lefevre@seybank.com', '5051 Mahe Lane', '+248 2556789'),
(147, 'Pamela Martin', 'employee', 5, 'p2q3r4s5t6u7v8w9', 'pamela.martin@seybank.com', '5052 Mahe Lane', '+248 2556790'),
(148, 'Quincy Dubois', 'employee', 5, 'q3r4s5t6u7v8w9x0', 'quincy.dubois@seybank.com', '5053 Mahe Lane', '+248 2556791'),
(149, 'Rachel Fournier', 'employee', 5, 'r4s5t6u7v8w9x0y1', 'rachel.fournier@seybank.com', '5054 Mahe Lane', '+248 2556792'),
(150, 'Sam Roche', 'employee', 5, 's5t6u7v8w9x0y1z2', 'sam.roche@seybank.com', '5055 Mahe Lane', '+248 2556793'),
(151, 'Tina Marcel', 'employee', 5, 't6u7v8w9x0y1z2a3', 'tina.marcel@seybank.com', '5056 Mahe Lane', '+248 2556794'),
(152, 'Uma Valois', 'employee', 5, 'u7v8w9x0y1z2a3b4', 'uma.valois@seybank.com', '5057 Mahe Lane', '+248 2556795'),
(153, 'Vera Martin', 'employee', 5, 'v8w9x0y1z2a3b4c5', 'vera.martin@seybank.com', '5058 Mahe Lane', '+248 2556796'),
(154, 'Walter Dupont', 'employee', 5, 'w9x0y1z2a3b4c5d6', 'walter.dupont@seybank.com', '5059 Mahe Lane', '+248 2556797'),
(155, 'Xena Durand', 'employee', 5, 'x0y1z2a3b4c5d6e7', 'xena.durand@seybank.com', '5060 Mahe Lane', '+248 2556798');


-- Insert data into `account`

INSERT INTO account (account_id, customer_id, branch_id, type, balance, start_date, status)
VALUES 
(10000001, 100001, 1, 'saving', 3500.00, '2022-12-20', 'active'),
(10000002, 100002, 2, 'checking', 9000.00, '2023-01-10', 'active'),
(10000003, 100003, 3, 'saving', 7000.00, '2023-02-15', 'blocked'),
(10000004, 100004, 4, 'checking', 13000.00, '2023-03-05', 'deactivated'),
(10000005, 100005, 5, 'saving', 10000.00, '2023-03-25', 'expired'),
(10000006, 100006, 1, 'checking', 19000.00, '2023-04-10', 'active'),
(10000007, 100007, 2, 'saving', 6000.00, '2023-05-08', 'active'),
(10000008, 100008, 3, 'checking', 21000.00, '2023-06-12', 'blocked'),
(10000009, 100009, 4, 'saving', 8500.00, '2023-07-01', 'active'),
(10000010, 100010, 5, 'checking', 16000.00, '2023-07-22', 'active'),
(10000011, 100009, 4, 'saving', 21000.00, '2023-07-01', 'active'),
(10000012, 100002, 2, 'saving', 46000.00, '2023-07-01', 'active'),
(10000013, 100006, 1, 'saving', 8000.00, '2023-07-01', 'active');


-- Insert data into `saving_account_plans`
INSERT INTO saving_account_plans (plan_id, plan_name, interest_rate, min_balance, max_monthly_withdraw)
VALUES 
(1, 'Children Plan', 12.00, 0, 5),       
(2, 'Teen Plan', 11.00, 500, 5),          
(3, 'Adult Plan', 10.00, 1000, 5),       
(4, 'Senior Plan', 13.00, 1000, 5);       
-- Insert data into `saving_account`

INSERT INTO saving_account (account_id, monthly_withdrawals, plan_id)
VALUES 
-- (10000001, 2, 1, 2500.00, '2022-12-20'),  
-- (10000003, 3, 1, 6000.00, '2023-02-15'),  
-- (10000005, 5, 2, 9000.00, '2023-03-25'),  
-- (10000007, 1, 1, 5000.00, '2023-05-08'),  
-- (10000009, 0, 2, 7500.00, '2023-07-01'),  
-- (10000011, 0, 2, 20000.00, '2023-07-01'), 
-- (10000012, 0, 2, 45000.00, '2023-07-01'), 
-- (10000013, 0, 1, 7000.00, '2023-07-01')
(10000001, 2, 1),
(10000003, 3, 1),
(10000005, 5, 2),
(10000007, 1, 1),
(10000009, 0, 2),
(10000011, 0, 2),
(10000012, 0, 2),
(10000013, 0, 1);


-- Insert data into `checking_account`
-- INSERT INTO checking_account (account_id, start_date, balance)
-- VALUES 
-- (10000002, '2023-01-10', 8000.00),
-- (10000004, '2023-03-05', 12000.00),
-- (10000006, '2023-04-10', 18000.00),
-- (10000008, '2023-06-12', 20000.00),
-- (10000010, '2023-07-22', 15000.00);

-- Insert data into `loans`

INSERT INTO loans (loan_id, amount, account_id, rate, monthly_installment, duration_months, start_date, type, status)
VALUES 
(1, 10000.00, 10000001, 3.50, 500, 24, '2023-01-01', 'physical', 'pending'),  
(2, 5000.00, 10000005, 2.00, 300, 12, '2023-02-01', 'online', 'overdue'),       
(3, 15000.00, 10000003, 4.00, 700, 36, '2023-03-01', 'physical', 'paid'),       
(4, 2000.00, 10000009, 1.50, 100, 6, '2023-04-01', 'online', 'pending');     



-- Insert data into `transaction_log`
INSERT INTO transaction_log (transaction_id, account_id, date, amount, type)
VALUES 
(1, 10000001, '2023-01-01 10:00:00', 500.00, 'deposit'),     
(2, 10000002, '2023-02-01 11:00:00', 1000.00, 'withdrawal'),  
(3, 10000003, '2023-03-01 12:00:00', 1500.00, 'deposit'),     
(4, 10000004, '2023-04-01 13:00:00', 2000.00, 'withdrawal'),  
(5, 10000005, '2023-05-01 14:00:00', 2500.00, 'transfer');     


-- Insert data into `intra_bank_transfer_log`
INSERT INTO intra_bank_transfer_log (transaction_id, receive_transaction_id)
VALUES 
(10000007, 10000009);




-- Insert data into `physical_loan`
INSERT INTO physical_loan (loan_id, account_id, approved_by)
VALUES 
(1, 10000001, 102),  -- Approved by manager in branch 2
(3, 10000003, 104);  -- Approved by manager in branch 4


-- Insert data into `fd_plans`

INSERT INTO fd_plans (plan_id, duration_months, rate)
VALUES 
(1, 6, 13.00),    
(2, 12, 14.00),   
(3, 36, 15.00);

-- Insert data into `fixed_deposit`
INSERT INTO fixed_deposit (fd_id, account_id, plan_id, start_date, amount)
VALUES 
(10000001, 10000007, 1, '2023-01-01', 5000.00),  
(10000002, 10000009, 2, '2023-05-01', 7500.00),  
(10000003, 10000005, 1, '2022-12-12', 9000.00);  


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
-- For loan_id 1 (physical loan, amount: 10000, monthly_installment: 500)
(1, 1, '2023-02-01', 500.00, '2023-02-01 10:00:00', 'paid'),
(1, 2, '2023-03-01', 500.00, '2023-03-01 10:00:00', 'paid'),
(1, 3, '2023-04-01', 500.00, NULL, 'pending'),  -- Next installment

-- For loan_id 2 (online loan, amount: 5000, monthly_installment: 300)
(2, 1, '2023-04-01', 300.00, NULL, 'pending'),  -- Next installment

-- For loan_id 3 (physical loan, amount: 15000, monthly_installment: 700)
(3, 1, '2023-04-01', 700.00, '2023-04-01 11:00:00', 'paid'),
(3, 2, '2023-05-01', 700.00, NULL, 'pending'),  -- Next installment
(3, 3, '2023-06-01', 700.00, NULL, 'pending'),  -- Following installments

-- For loan_id 4 (online loan, amount: 2000, monthly_installment: 100)
(4, 1, '2023-05-01', 100.00, '2023-05-01 12:00:00', 'paid'),
(4, 2, '2023-06-01', 100.00, NULL, 'pending');  -- Next installment