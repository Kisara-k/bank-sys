
--------------------------------------------------------------------------

--------------procedure for get balance

DELIMITER //
CREATE PROCEDURE get_balance(IN acc_id INT,OUT balance DECIMAL(15,2))
BEGIN
SELECT balance INTO balance FROM account WHERE account_id = acc_id;
END //
DELIMITER

	
--------------- procudure for create account

DELIMITER //
CREATE PROCEDURE create_account(
	IN customer_type ENUM('individual', 'organization'),IN phone CHAR(10),IN passkey VARCHAR(255),IN email VARCHAR(50),IN address VARCHAR(255),IN fname VARCHAR(50),IN lname VARCHAR(50),IN bday DATE,IN nic VARCHAR(12), 
	IN acc_id INT,IN branch_id SMALLINT,IN acc_type ENUM('saving', 'checking'),IN amount NUMERIC(15,2),IN start_date Date,IN organization_name VARCHAR(50),IN reg_no VARCHAR(50),IN contact_person VARCHAR(50),IN position VARCHAR(20),IN plan_id TINYINT
	)
BEGIN
    DECLARE new_customer_id INT;
    DECLARE new_account_id INT;

    INSERT INTO customer(type, contact_number, hashed_password, email, address)
    VALUES(customer_type, TRIM(phone), passkey, email, address);
    SET new_customer_id = LAST_INSERT_ID();

    IF customer_type = 'individual' THEN
        INSERT INTO individual_customer(customer_id, first_name, last_name, date_of_birth, nic, image_path)
        VALUES(new_customer_id, fname, lname, bday, nic, "");
    ELSE
        INSERT INTO organization_customer(customer_id, name, registration_no, contact_person, contact_person_position)
        VALUES(new_customer_id, organization_name, reg_no, contact_person, position);
    END IF;

    INSERT INTO account(customer_id, branch_id, type, balance, start_date, status)
    VALUES(new_customer_id, branch_id, acc_type, amount, start_date, "active");
    SET new_account_id = LAST_INSERT_ID();

    IF acc_type = 'saving' THEN
        INSERT INTO saving_account(account_id, monthly_withdrawals, plan_id, balance, start_date)
        VALUES(new_account_id, 5, plan_id, amount, start_date);
    END IF;
END //
DELIMITER ;


---------------insert employee 

DELIMITER //
CREATE PROCEDURE insert_employee(
	IN name VARCHAR(50),IN role ENUM('employee', 'manager'),IN branch_id INT,IN passkey VARCHAR(255),IN email VARCHAR(100),IN address VARCHAR(255),IN phone CHAR(10)
	)
BEGIN
    INSERT INTO employees(name, role, branch_id, hashed_password, email, address, contact_number)
    VALUES(name, role, branch_id, passkey, email, address, phone);
END //
DELIMITER ;


-------------- withdraw money

DELIMITER //
CREATE PROCEDURE withdraw_money(IN amount DECIMAL(15,2),IN acc_id INT,IN acc_type ENUM('saving','checking'),OUT status_w INT)
BEGIN
    DECLARE current_amount DECIMAL(15,2);
    DECLARE minimum DECIMAL(15,2);
    DECLARE monthly_with SMALLINT;
    DECLARE can_withdraw BOOLEAN DEFAULT FALSE;

    START TRANSACTION;

    SELECT balance INTO current_amount FROM account WHERE account_id = acc_id;
    SELECT 'Current Balance: ', current_amount;  -- Debug output

    IF acc_type = 'saving' THEN
        SELECT min_balance INTO minimum FROM saving_account_plans WHERE plan_id = (SELECT plan_id FROM saving_account WHERE account_id = acc_id);
        SELECT 'Min Balance: ', minimum;  -- Debug output
        SELECT monthly_withdrawals INTO monthly_with FROM saving_account WHERE account_id = acc_id;
        SELECT 'Monthly Withdrawals: ', monthly_with;  -- Debug output

        IF current_amount - amount >= minimum AND monthly_with > 0 THEN
            SET can_withdraw = TRUE;
        END IF;

    ELSEIF acc_type = 'checking' THEN
        IF current_amount >= amount THEN
            SET can_withdraw = TRUE;
        END IF;
    END IF;

    IF can_withdraw THEN
        UPDATE account SET balance = balance - amount WHERE account_id = acc_id;
        IF acc_type = 'saving' THEN
            UPDATE saving_account SET monthly_withdrawals = monthly_withdrawals - 1 WHERE account_id = acc_id;
        END IF;
        INSERT INTO transaction_log (account_id, amount, type)
        VALUES (acc_id, amount, 'withdrawal');
        COMMIT;
        SET status_w = 1;
        SELECT 'Transaction committed';  -- Debug output
    ELSE
        ROLLBACK;
        SET status_w = 0;
        SELECT 'Transaction rolled back';  -- Debug output
    END IF;
END //
DELIMITER ;


-------------- deposit money

DELIMITER //
CREATE PROCEDURE deposite(IN amount DECIMAL(15,2),IN acc_id INT,OUT status_d INT)
BEGIN
    START TRANSACTION;
    UPDATE account SET balance = balance + amount WHERE account_id = acc_id;
    IF ROW_COUNT() > 0 THEN
        INSERT INTO transaction_log (account_id, amount, type)
        VALUES (acc_id, amount, 'deposit');
        COMMIT;
        SET status_d = 1;
    ELSE
        ROLLBACK;
        SET status_d = 0;
    END IF;
END //
DELIMITER ;


------- open fixed deposite account

DELIMITER //
CREATE PROCEDURE insert_into_fixed_deposit(IN amount DECIMAL(15,2), IN acc_id INT, IN acc_type ENUM('saving','checking'), IN plan_id SMALLINT, IN date DATE,OUT status_f INT)
BEGIN
  DECLARE withdrawal_status INT DEFAULT 0;

  START TRANSACTION;

  CALL withdraw_money(amount, acc_id, acc_type, withdrawal_status);
  SELECT 'Withdrawal procedure called', withdrawal_status;  -- Debug output


  IF withdrawal_status = 1 THEN
    INSERT INTO fixed_deposit (account_id, plan_id, start_date, amount)
    VALUES (acc_id, plan_id, date, amount);
    SELECT 'Data inserted into fixed_deposit';  -- Debug output

    -- Commit the transaction
    COMMIT;
    SET status_f=1;
    SELECT 'Transaction committed in insert_into_fixed_deposit';  -- Debug output
  ELSE
    -- Rollback if withdrawal failed
    ROLLBACK;
    SET status_f=0;
    SELECT 'Transaction rolled back in insert_into_fixed_deposit';  -- Debug output
  END IF;

END//
DELIMITER ;


--------money transaction

DELIMITER //
CREATE PROCEDURE transaction_money(IN amount DECIMAL(15,2),IN from_acc INT,IN to_acc INT,IN acc_type ENUM('saving','checking'),OUT status_p INT)
BEGIN
  DECLARE current_amount DECIMAL(15,2);
  DECLARE minimum INT;
  DECLARE monthly_with SMALLINT;
  DECLARE affected_rows INT;
  DECLARE last_id INT;
  
  -- Start transaction
  START TRANSACTION;

  -- Check current balance
  SELECT balance INTO current_amount FROM account WHERE account_id=from_acc;
  SELECT 'Current Balance: ', current_amount;  -- Debug output
  
  SELECT min_balance INTO minimum FROM saving_account_plans WHERE plan_id IN (SELECT plan_id FROM saving_account WHERE account_id=from_acc);
  SELECT 'Min Balance: ', minimum;  -- Debug output

	SELECT monthly_withdrawals INTO monthly_with FROM saving_account WHERE saving_account.account_id=from_acc;
    SELECT 'Monthly Withdrawals: ', monthly_with;-- Debug output
    
  -- Withdrawal logic for saving account
  IF acc_type="saving" THEN 

    -- Check if withdrawal is allowed
    IF current_amount - amount >= minimum THEN
      UPDATE account SET balance=balance-amount WHERE account_id=from_acc;
      SELECT ROW_COUNT() INTO affected_rows;
      SELECT 'Rows Affected with (Saving): ', affected_rows;  -- Debug output
      IF affected_rows > 0 THEN
       UPDATE account SET balance=balance+amount WHERE account_id=to_acc;
       SELECT ROW_COUNT() INTO affected_rows;
       SELECT 'Rows Affected depo (Saving): ', affected_rows;  -- Debug output
        IF affected_rows > 0 THEN 
          INSERT INTO transaction_log (account_id, date, amount, type)
          VALUES (from_acc, NOW(), amount, 'transfer');
          SELECT ROW_COUNT() INTO affected_rows;
          IF affected_rows > 0 THEN
            SET last_id=LAST_INSERT_ID();
            INSERT INTO intra_bank_transfer_log(transaction_id,receive_transaction_id)
            VALUES(last_id,to_acc);
            SELECT ROW_COUNT() INTO affected_rows;
          END IF;
        END IF;
      END IF;
    ELSE
      SELECT 'Withdrawal not allowed due to insufficient balance or withdrawal limits';  -- Debug output
    END IF;

  -- Withdrawal logic for checking account
  ELSE
    IF current_amount >= amount THEN
      UPDATE account SET balance=balance-amount WHERE account_id=from_acc;
      SELECT ROW_COUNT() INTO affected_rows;
      SELECT 'Rows Affected with (Checking): ', affected_rows;  -- Debug output
      IF affected_rows > 0 THEN
        UPDATE account SET balance=balance+amount WHERE account_id=to_acc;
        SELECT ROW_COUNT() INTO affected_rows;
        SELECT 'Rows Affected depo (Saving): ', affected_rows;  -- Debug output
        IF affected_rows > 0 THEN 
          INSERT INTO transaction_log (account_id, date, amount, type)
          VALUES (from_acc, NOW(), amount, 'transfer');
          SELECT ROW_COUNT() INTO affected_rows;
          IF affected_rows > 0 THEN
            SET last_id=LAST_INSERT_ID();
            INSERT INTO intra_bank_transfer_log(transaction_id,receive_transaction_id)
            VALUES(last_id,to_acc);
            SELECT ROW_COUNT() INTO affected_rows;
          END IF;
        END IF;
      END IF;
    ELSE
      SELECT 'Insufficient funds for checking account';  -- Debug output
    END IF;
  END IF;

  -- Commit or rollback
  IF affected_rows > 0 THEN
    COMMIT;
    SET status_p=1;
    SELECT 'Transaction committed';  -- Debug output
  ELSE
    ROLLBACK;
    SET status_p=0;
    SELECT 'Transaction rolled back';  -- Debug output
  END IF;
  
END//
DELIMITER ;

-----------------branch wise transaction report
DELIMITER //
CREATE PROCEDURE transaction_report(IN branch_id INT)
BEGIN
  SELECT transaction_log.transaction_id,transaction_log.account_id,amount,transaction_log.type,intra_bank_transfer_log.receive_transaction_id,date FROM transaction_log 
  LEFT OUTER JOIN intra_bank_transfer_log ON transaction_log.transaction_id=intra_bank_transfer_log.transaction_id
  JOIN account ON transaction_log.account_id=account.account_id WHERE account.branch_id=branch_id;
END //
DELIMITER ;

-----------------late loan installments report
DELIMITER //
CREATE PROCEDURE late_loan_installments(IN branch_id INT)
BEGIN
  SELECT loans.loan_id, loan_installment_log.installment_id, loan_installment_log.due_date, 
       loan_installment_log.amount, loan_installment_log.payment_date, 
       loan_installment_log.status, loans.account_id,account.branch_id
  FROM loans
  JOIN loan_installment_log ON loans.loan_id = loan_installment_log.loan_id
  JOIN account ON account.account_id = loans.account_id
  WHERE loan_installment_log.status = 'overdue';
END //
DELIMITER ;


-------------------------online loan apply

DELIMITER //
CREATE PROCEDURE apply_online_loan(
    IN accountNo INT,
    IN loan_amount DECIMAL(15, 2),
    IN duration INT,
    OUT loan_status VARCHAR(255)
)
BEGIN
    DECLARE fd_amount DECIMAL(15, 2);
    DECLARE savings_account_id INT;
    DECLARE max_loan_amount DECIMAL(15, 2);
    DECLARE loan_rate DECIMAL(4, 2);
    DECLARE monthly_installment_ DECIMAL(15, 2);
    DECLARE new_loan_id INT;
    
    -- Exit handler for SQL exceptions
    

    -- Start the transaction
    START TRANSACTION;

    -- Retrieve FD details for the account
    SELECT fd.amount, fd.account_id
    INTO fd_amount, savings_account_id
    FROM fixed_deposit fd
    WHERE fd.fd_id = accountNo;

    -- Debug output: FD amount and savings account ID
    SELECT CONCAT('FD amount: ', fd_amount, ', Savings Account ID: ', savings_account_id);

    -- Check if the FD exists
    IF fd_amount IS NULL THEN
        SET loan_status = 'No Fixed Deposit account found for this customer.';
        ROLLBACK;
    ELSE
        -- Calculate maximum loan the customer can apply for (60% of FD or max 500,000)
        SET max_loan_amount = LEAST(fd_amount * 0.60, 500000.00);

        -- Debug output: Maximum loan amount
        SELECT CONCAT('Maximum Loan Amount: ', max_loan_amount);

        -- Check if requested loan exceeds maximum allowed
        IF loan_amount > max_loan_amount THEN
            SET loan_status = CONCAT('Loan amount exceeds the limit. Maximum allowed: ', max_loan_amount);
            ROLLBACK;
        ELSE
            -- Set loan interest rate (Example: 5%)
            SET loan_rate = 5.00;

            -- Debug output: Loan rate
            SELECT CONCAT('Loan Rate: ', loan_rate);

            -- Calculate the monthly installment
            SET monthly_installment_ = (loan_amount * (1 + (loan_rate / 100))) / duration;

            -- Debug output: Monthly installment
            SELECT CONCAT('Monthly Installment: ', monthly_installment_);

            -- Generate a new loan_id (assuming auto-increment is not used)
            SELECT IFNULL(MAX(loan_id), 0) + 1 INTO new_loan_id FROM loans;

            -- Debug output: New loan ID
            SELECT CONCAT('New Loan ID: ', new_loan_id);

            -- Insert the loan into the loans table
            INSERT INTO loans (
                loan_id, account_id, amount, rate, monthly_installment,
                duration_months, start_date, type, status
            )
            VALUES (
                new_loan_id, accountNo, loan_amount, loan_rate,
                monthly_installment_, duration, CURDATE(), 'online', 'approved'
            );

            -- Update the balance of the linked savings account
            UPDATE account
            SET balance = balance + loan_amount
            WHERE account_id = savings_account_id;

            -- Debug output: Loan approved and balance updated
            SELECT 'Loan approved and savings account balance updated';

            -- Commit the transaction
            COMMIT;

            -- Set loan status to success
            SET loan_status = 'Loan approved and deposited into the savings account.';
        END IF;
    END IF;

END//
DELIMITER ;


----------------------------physical loan apply
DELIMITER //
CREATE PROCEDURE physical_loan(IN amount DECIMAL(15,2),IN acc_id INT,IN duration INT,IN date DATE,OUT loan_state VARCHAR(50))
BEGIN
  DECLARE loan_rate DECIMAL(4, 2);
  DECLARE monthly_installment DECIMAL(15, 2);
  DECLARE new_loan_id INT;
  DECLARE affected_rows INT;

  SET loan_rate = 5.00;
  SET monthly_installment= (amount * (1 + (loan_rate / 100))) / duration;
  SELECT IFNULL(MAX(loan_id), 0) + 1 INTO new_loan_id FROM loans;

  INSERT INTO loans(loan_id,amount,account_id,rate,monthly_installment,duration_months,start_date,type,status)
  VALUES (new_loan_id,amount,acc_id,loan_rate,monthly_installment,duration,date,"physical","pending");
  SELECT ROW_COUNT() INTO affected_rows;

  IF affected_rows > 0 THEN
    COMMIT;
    SET loan_state='Physical loan apply success';
    SELECT "Physical loan added to table";

  ELSE 
    ROLLBACK;
    SET loan_state='Physical loan apply fail!';
    SELECT "Rollback loan";
  END IF;
END //
DELIMITER ;


---------------------------manager loan approve
DELIMITER //

CREATE PROCEDURE approve_loan(IN acc_id INT, IN p_loan_id INT, IN manager_id INT,OUT status INT)
BEGIN
  DECLARE affected_rows INT DEFAULT 0;
  DECLARE l_amount DECIMAL(15,2);
  DECLARE out_state INT DEFAULT 0;

  -- Start transaction
  START TRANSACTION;

  -- Retrieve loan amount
  SELECT amount INTO l_amount FROM loans WHERE loan_id = p_loan_id;

  -- Approve the loan by updating its status
  UPDATE loans SET status = 'approved' WHERE loan_id = p_loan_id;
  SELECT ROW_COUNT() INTO affected_rows;

  IF affected_rows > 0 THEN
    -- Insert into physical_loan table
    INSERT INTO physical_loan (loan_id, account_id, approved_by)
    VALUES (p_loan_id, acc_id, manager_id);
    
    SELECT ROW_COUNT() INTO affected_rows;

    IF affected_rows > 0 THEN
      -- Call deposit procedure to deposit the loan amount into the account
      CALL deposit(l_amount, acc_id, out_state);
      
      IF out_state > 0 THEN
        -- Check if deposit was successful
        COMMIT;
        SET status=1;
        SELECT 'Loan approved successfully' AS status_message;
      ELSE
        -- Rollback if deposit fails
        ROLLBACK;
        SELECT 'Loan approval failed during deposit' AS status_message;
      END IF;
    ELSE
      -- Rollback if insertion into physical_loan fails
      ROLLBACK;
      SELECT 'Loan approval failed during physical_loan insert' AS status_message;
    END IF;
  ELSE
    -- Rollback if loan approval update fails
    ROLLBACK;
    SELECT 'Loan approval failed during status update' AS status_message;
  END IF;
END //

DELIMITER ;


-------------------------manager loan reject
DELIMITER //
CREATE PROCEDURE reject_loan(IN p_loan_id INT,IN manager_id INT,IN acc_id INT,OUT status INT)
BEGIN
    DECLARE affected_rows INT;

    START TRANSACTION;

    UPDATE loans SET status="rejected" WHERE loan_id=p_loan_id;
    SELECT ROW_COUNT() INTO affected_rows;

    IF affected_rows > 0 THEN 
      INSERT INTO physical_loan (loan_id, account_id, approved_by)
      VALUES (p_loan_id, acc_id, manager_id);
      SELECT ROW_COUNT() INTO affected_rows;
	END IF;
  
  IF affected_rows > 0 THEN
    COMMIT;
    SET status=1;
  ELSE
    ROLLBACK;
    SET status=0;
  END IF;
END //
DELIMITER ;

-------------------detail in nic
DELIMITER //
CREATE PROCEDURE detail_nic(IN nic VARCHAR(12))
BEGIN
    SELECT first_name,last_name,date_of_birth,nic,customer.type,customer.contact_number,address
    account_id,account.type,balance,start_date,status,city FROM individual_customer
    JOIN customer ON individual_customer.customer_id=customer.customer_id
    JOIN account ON  account.customer_id=customer.customer_id
    JOIN branches ON branches.branch_id=account.branch_id
    WHERE individual_customer.nic=nic;
END//
DELIMITER ;

---------------------detail with reg no
DELIMITER //
CREATE PROCEDURE detail_reg_no(IN reg_no VARCHAR(12))
BEGIN
    SELECT name,registration_no,contact_person,contact_person_position,customer.customer_type,customer.contact_number,customer.address,
    account_id,account.type,balance,start_date,status,city FROM organization_customer
    JOIN customer ON organization_customer.customer_id=customer.customer_id
    JOIN account ON  account.customer_id=customer.customer_id
    JOIN branches ON branches.branch_id=account.branch_id
    WHERE organization_customer.registration_no=reg_no;
END//
DELIMITER ;


------------------detail with acc no
DELIMITER //
CREATE PROCEDURE detail_acc_no(IN acc_id INT)
BEGIN
    DECLARE cus_type ENUM('individual','organization');
    SELECT customer_type INTO cus_type FROM account 
    JOIN customer ON account.customer_id=customer.customer_id WHERE account.account_id=acc_id;

    IF cus_type="individual" THEN
      SELECT first_name,last_name,date_of_birth,nic,customer.customer_type,customer.contact_number,customer.address,
      account_id,account.type,balance,start_date,status,city FROM individual_customer
      JOIN customer ON individual_customer.customer_id=customer.customer_id
      JOIN account ON  account.customer_id=customer.customer_id
      JOIN branches ON branches.branch_id=account.branch_id
      WHERE account.account_id=acc_id;
    ELSE
      SELECT name,registration_no,contact_person,contact_person_position,customer.customer_type,customer.contact_number,customer.address,
      account_id,account.type,balance,start_date,status,city FROM organization_customer
      JOIN customer ON organization_customer.customer_id=customer.customer_id
      JOIN account ON  account.customer_id=customer.customer_id
      JOIN branches ON branches.branch_id=account.branch_id
      WHERE account.account_id=acc_id;
    END IF;
END//
DELIMITER ;
  




--------------------loan
CREATE DEFINER=`root`@`localhost` PROCEDURE `apply_online_loan`(
    IN accountNo INT,
    IN loan_amount DECIMAL(15, 2),
    IN duration INT,
    OUT loan_status VARCHAR(255)
)
BEGIN
    DECLARE fd_amount DECIMAL(15, 2);
    DECLARE savings_account_id INT;
    DECLARE max_loan_amount DECIMAL(15, 2);
    DECLARE loan_rate DECIMAL(4, 2);
    DECLARE monthly_installment_ INT;
    DECLARE new_loan_id INT;

    -- Exit handler for SQL exceptions
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET loan_status = 'Error occurred, transaction failed.';
    END;

    -- Start the transaction
    START TRANSACTION;

    -- Retrieve FD details for the account
    SELECT fd.amount, fd.account_id
    INTO fd_amount, savings_account_id
    FROM fixed_deposit fd
    WHERE fd.fd_id = accountNo;

    -- Check if the FD exists
    IF fd_amount IS NULL THEN
        SET loan_status = 'No Fixed Deposit account found for this customer.';
        ROLLBACK;
    ELSE
        -- Calculate maximum loan the customer can apply for (60% of FD or max 500,000)
        SET max_loan_amount = LEAST(fd_amount * 0.60, 500000.00);

        -- Check if requested loan exceeds maximum allowed
        IF loan_amount > max_loan_amount THEN
            SET loan_status = CONCAT('Loan amount exceeds the limit. Maximum allowed: ', max_loan_amount);
            ROLLBACK;
        ELSE
            -- Set loan interest rate (Example: 5%)
            SET loan_rate = 5.00;

            -- Calculate the monthly installment
            SET monthly_installment_ = (loan_amount * (1 + (loan_rate / 100))) / duration;

            -- Generate a new loan_id (assuming auto-increment is not used)
            SELECT IFNULL(MAX(loan_id), 0) + 1 INTO new_loan_id FROM loans;

            -- Insert the loan into the loans table
            INSERT INTO loans (
                loan_id, account_id, amount, rate, monthly_installment,
                duration_months, start_date, type, status
            )
            VALUES (
                new_loan_id, accountNo, loan_amount, loan_rate,
                monthly_installment_, duration, CURDATE(), 'online', 'pending'
            );

            -- Update the balance of the linked savings account
            UPDATE saving_account
            SET balance = balance + loan_amount
            WHERE account_id = savings_account_id;

            -- Commit the transaction
            COMMIT;

            -- Set loan status to success
            SET loan_status = 'Loan approved and deposited into the savings account.';
        END IF;
    END IF;

END;

-- loan installment
DELIMITER //
CREATE PROCEDURE calculate_loan_installment(IN loanID INT)
BEGIN
    DECLARE loan_amount DECIMAL(15, 2);
    DECLARE rate DECIMAL(4, 2);
    DECLARE duration INT;
    DECLARE total_interest DECIMAL(15, 2);
    DECLARE monthly_installment DECIMAL(15, 2);
    DECLARE i INT DEFAULT 1;

    -- Get loan details
    SELECT amount, rate, duration_months INTO loan_amount, rate, duration
    FROM loans WHERE loan_id = loanID;

    -- Prevent division by zero
    IF duration > 0 THEN
        -- Calculate monthly installment
        SET total_interest = (loan_amount * (rate / 100) * (duration / 12));
        SET monthly_installment = (loan_amount + total_interest) / duration;

        -- Insert the calculated installments into loan_installment_log table
        WHILE i <= duration DO
            INSERT INTO loan_installment_log (loan_id, installment_id, due_date, amount, status)
            VALUES (loanID, i, DATE_ADD(CURDATE(), INTERVAL i MONTH), monthly_installment, 'pending');
            SET i = i + 1;
        END WHILE;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Duration cannot be zero.';
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE TRIGGER create_loan_installments AFTER INSERT ON loans
FOR EACH ROW
BEGIN
    CALL calculate_loan_installment(NEW.loan_id);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE pay_installment(IN installmentID INT, IN loanID INT)
BEGIN
    DECLARE total_paid INT;
    UPDATE loan_installment_log
    SET payment_date = NOW(), status = 'paid'
    WHERE installment_id = installmentID AND loan_id = loanID;

    -- Check if all installments are paid

    SELECT COUNT(*) INTO total_paid
    FROM loan_installment_log
    WHERE loan_id = loanID AND status = 'pending';

    IF total_paid = 0 THEN
        UPDATE loans
        SET status = 'paid'
        WHERE loan_id = loanID;
    END IF;
END //
DELIMITER ;