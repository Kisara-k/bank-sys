
-- Trigger to Block Expired Accounts
CREATE TRIGGER block_expired_accounts
BEFORE UPDATE ON account
FOR EACH ROW
BEGIN
  IF NEW.status = 'expired' THEN
    UPDATE account_status_log
    SET set_status_action = 'block', date = NOW()
    WHERE account_id = NEW.account_id;
  END IF;
END;

--Trigger to Update Loan Status after Installment Payments
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
END;

------------------------------------------------------------------------------------
                                --implemented triggers

--insert into checking account
DELIMITER //
CREATE TRIGGER insert_checking
AFTER INSERT ON account
FOR EACH ROW
BEGIN
  IF NEW.type='checking' THEN
    INSERT INTO checking_account(account_id,start_date,balance)
    VALUES(NEW.account_id,NEW.start_date,NEW.balance);
    END IF;
END //
DELIMITER ;

-- update saving and checking account when update account
DELIMITER //
CREATE TRIGGER update_account_after_saving_or_checking_update
AFTER UPDATE ON account
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM saving_account WHERE saving_account.account_id = NEW.account_id) THEN
        UPDATE saving_account SET balance = NEW.balance WHERE account_id = NEW.account_id;
        --(make change in DB)UPDATE saving_account SET monthly_withdrawals = monthly_withdrawals-1 WHERE account_id = NEW.account_id;
    ELSEIF EXISTS (SELECT 1 FROM checking_account WHERE checking_account.account_id = NEW.account_id) THEN
        UPDATE checking_account SET balance = NEW.balance WHERE account_id = NEW.account_id;
    END IF;
END//
DELIMITER ;


