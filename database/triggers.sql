

-- Trigger to Block Expired Accounts
DELIMITER //
CREATE TRIGGER block_expired_accounts
BEFORE UPDATE ON account
FOR EACH ROW
BEGIN
  IF NEW.status = 'expired' THEN
    UPDATE account_status_log
    SET set_status_action = 'block', date = NOW()
    WHERE account_id = NEW.account_id;
  END IF;
END //

-- Trigger to Update Loan Status after Installment Payments

CREATE TRIGGER update_loan_status_after_payment
AFTER UPDATE ON loan_installment_log
FOR EACH ROW
BEGIN
  DECLARE total_amount_paid DECIMAL(15,2);
  SELECT SUM(amount) INTO total_amount_paid FROM loan_installment_log WHERE loan_id = NEW.loan_id AND status = 'paid';
  
  IF total_amount_paid >= (SELECT amount FROM loans WHERE loan_id = NEW.loan_id) THEN
    UPDATE loans 
    SET status = 'paid'
    WHERE loan_id = NEW.loan_id;
  END IF;
END //

------------------------------------------------------------------------------------ 
-- implemented triggers

-- insert into checking account
-- CREATE TRIGGER insert_checking
-- AFTER INSERT ON account
-- FOR EACH ROW
-- BEGIN
--   IF NEW.type='checking' THEN
--     INSERT INTO checking_account(account_id,start_date,balance)
--     VALUES(NEW.account_id,NEW.start_date,NEW.balance);
--     END IF;
-- END //
-- DELIMITER ;

-- update saving and checking account when update account
-- DELIMITER //
-- CREATE TRIGGER update_account_after_saving_or_checking_update
-- AFTER UPDATE ON account
-- FOR EACH ROW
-- BEGIN
--     IF EXISTS (SELECT 1 FROM saving_account WHERE saving_account.account_id = NEW.account_id) THEN
--         UPDATE saving_account SET balance = NEW.balance WHERE account_id = NEW.account_id;
--     ELSEIF EXISTS (SELECT 1 FROM checking_account WHERE checking_account.account_id = NEW.account_id) THEN
--         UPDATE checking_account SET balance = NEW.balance WHERE account_id = NEW.account_id;
--     END IF;
-- END//


--------------------- after physical loan approve

CREATE TRIGGER after_physical_loan_approval
AFTER UPDATE ON loans
FOR EACH ROW
BEGIN
    DECLARE i INT DEFAULT 1;

    -- Check if the loan status was changed to "approved"
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        -- Loop to insert a record for each installment in the loan_installment_log table
        WHILE i <= NEW.duration_months DO
            INSERT INTO loan_installment_log (loan_id, installment_id, due_date, amount, payment_date, status)
            VALUES (NEW.loan_id, i, DATE_ADD(NEW.start_date, INTERVAL i MONTH), NEW.monthly_installment, NULL, 'pending');
            SET i = i + 1;
        END WHILE;
    END IF;
END//


------------------ after loan insert(online)

CREATE TRIGGER after_loan_insert
AFTER INSERT ON loans
FOR EACH ROW
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE monthly_payment DECIMAL(10, 2);
    DECLARE loan_status ENUM('pending','approved','rejected','paid','overdue');

    -- Calculate the monthly payment based on loan amount, interest rate, and total months (duration)
    SET monthly_payment = NEW.monthly_installment;
    SET loan_status=NEW.status;

    IF loan_status="approved" THEN 
    -- Loop to insert a record for each installment in the monthly_loan_installment_log table
      WHILE i <= NEW.duration_months DO
          INSERT INTO loan_installment_log (loan_id,installment_id,due_date,amount,payment_date,status)
          VALUES (NEW.loan_id,i, DATE_ADD(NEW.start_date, INTERVAL i MONTH), NEW.monthly_installment, null, 'pending');
          SET i = i + 1;
      END WHILE;
    END IF;
END //

CREATE TRIGGER create_loan_installments AFTER INSERT ON loans
FOR EACH ROW
BEGIN
    CALL calculate_loan_installment(NEW.loan_id);
END //

DELIMITER ;
