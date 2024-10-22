
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
CREATE PROCEDURE create_account(IN customer_id INT,IN customer_type ENUM('individual', 'organization'),IN phone CHAR(10),IN passkey VARCHAR(255),IN email VARCHAR(50),IN address VARCHAR(255),IN fname VARCHAR(50),IN lname VARCHAR(50),IN bday DATE,IN nic VARCHAR(12),
IN acc_id INT,IN branch_id SMALLINT,IN acc_type ENUM('saving', 'checking'),IN amount NUMERIC(15,2),IN start_date Date,IN organization_name VARCHAR(50),IN reg_no VARCHAR(50),IN contact_person VARCHAR(50),IN position VARCHAR(20),IN plan_id TINYINT)
BEGIN
IF customer_type="individual" THEN
  INSERT INTO customer(customer_id,customer_type,contact_number,hashed_password,email,address)
  VALUES(customer_id,customer_type,TRIM(phone),passkey,email,address);

  INSERT INTO individual_customer(customer_id,first_name,last_name,date_of_birth,nic,image_path)
  VALUES(customer_id,fname,lname,bday,nic,"");

ELSE
  INSERT INTO customer(customer_id,customer_type,contact_number,hashed_password,email,address)
  VALUES(customer_id,customer_type,TRIM(phone),passkey,email,address);

  INSERT INTO organization_customer(customer_id,name,registration_no,contact_person,contact_person_position)
  VALUES(customer_id,organization_name,reg_no,contact_person,position);

END IF;

INSERT INTO account(account_id,customer_id,branch_id,type,balance,start_date,status)
VALUES(acc_id,customer_id,branch_id,acc_type,amount,start_date,"active");

IF acc_type='saving' THEN
  INSERT INTO saving_account(account_id,monthly_withdrawals,plan_id,balance,start_date)
  VALUES(acc_id,5,plan_id,amount,start_date);
END IF;

END //
DELIMITER ;

---------------insert employee 

DELIMITER //
CREATE PROCEDURE insert_employee(IN em_id INT,IN name VARCHAR(50),IN role VARCHAR(20),IN branch_id INT,IN passkey VARCHAR(255),IN email VARCHAR(100),IN address VARCHAR(255),IN phone CHAR(10))
BEGIN
INSERT INTO employees(employee_id,name,role,branch_id,hashed_password,email,address,contact_number)
VALUES(em_id,name,role,branch_id,passkey,email,address,phone);
END //
DELIMITER ;

-------------- withdraw money
DELIMITER //
CREATE PROCEDURE withdraw_money(IN amount DECIMAL(15,2),IN acc_id INT,IN acc_type ENUM('saving','checking'),OUT status_w INT)
BEGIN
  DECLARE current_amount DECIMAL(15,2);
  DECLARE minimum INT;
  DECLARE monthly_with SMALLINT;
  DECLARE affected_rows INT;
  

  START TRANSACTION;


  SELECT balance INTO current_amount FROM account WHERE account_id=acc_id;
  SELECT 'Current Balance: ', current_amount;  -- Debug output
  
  SELECT min_balance INTO minimum FROM saving_account_plans WHERE plan_id IN (SELECT plan_id FROM saving_account WHERE account_id=acc_id);
  SELECT 'Min Balance: ', minimum;  -- Debug output

	SELECT monthly_withdrawals INTO monthly_with FROM saving_account WHERE saving_account.account_id=acc_id;
    SELECT 'Monthly Withdrawals: ', monthly_with;-- Debug output
    

  IF acc_type="saving" THEN 

    -- check condition
    IF current_amount - amount >= minimum AND monthly_with > 0 THEN
      UPDATE account SET balance=balance-amount WHERE account_id=acc_id;
      UPDATE saving_account SET monthly_withdrawals=monthly_withdrawals-1 WHERE account_id=acc_id;
      SELECT ROW_COUNT() INTO affected_rows;
      SELECT 'Rows Affected (Saving): ', affected_rows;  -- Debug output
      IF affected_rows > 0 THEN
        INSERT INTO transaction_log (account_id, date, amount, type)
        VALUES (acc_id, NOW(), amount, 'withdrawal');
        SELECT ROW_COUNT() INTO affected_rows;
      END IF;
    ELSE
      SELECT 'Withdrawal not allowed due to insufficient balance or withdrawal limits';  -- Debug output
    END IF;

  -- Withdrawal logic for checking account
  ELSE
    IF current_amount >= amount THEN
      UPDATE account SET balance=balance-amount WHERE account_id=acc_id;
      SELECT ROW_COUNT() INTO affected_rows;
      SELECT 'Rows Affected (Checking): ', affected_rows;  -- Debug output
      IF affected_rows > 0 THEN
        INSERT INTO transaction_log (account_id, date, amount, type)
        VALUES (acc_id, NOW(), amount, 'withdrawal');
        SELECT ROW_COUNT() INTO affected_rows;
      END IF;
    ELSE
      SELECT 'Insufficient funds for checking account';  -- Debug output
    END IF;
  END IF;

  -- Commit or rollback
  IF affected_rows > 0 THEN
    COMMIT;
    SET status_w=1;
    SELECT 'Transaction committed';  -- Debug output
  ELSE
    ROLLBACK;
    SET status_w=0;
    SELECT 'Transaction rolled back';  -- Debug output
  END IF;
  
END//
DELIMITER ;


-------------- deposite money
use bank;
DELIMITER //
CREATE PROCEDURE deposite(IN amount DECIMAL(15,2),IN acc_id INT,OUT status_d INT)
BEGIN
  DECLARE affected_rows INT;
  UPDATE account SET balance=balance+amount WHERE account.account_id=acc_id;
  SELECT ROW_COUNT() INTO affected_rows;
  IF affected_rows > 0 THEN 
    INSERT INTO transaction_log (account_id, date, amount, type)
    VALUES (acc_id, NOW(), amount, 'deposit');
    SELECT ROW_COUNT() INTO affected_rows;
  END IF;

  IF affected_rows > 0 THEN
   COMMIT;
   SET status_d=1;
  ELSE
    ROLLBACK;
    SET status_d=0;
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


-------loan
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