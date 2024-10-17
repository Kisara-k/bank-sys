-------------late loan report

CREATE VIEW late_loan_view AS 
SELECT loans.loan_id, loan_installment_log.installment_id, loan_installment_log.due_date, 
       loan_installment_log.amount, loan_installment_log.payment_date, 
       loan_installment_log.status, loans.account_id,account.branch_id
FROM loans
JOIN loan_installment_log ON loans.loan_id = loan_installment_log.loan_id
JOIN account ON account.account_id = loans.account_id
WHERE loan_installment_log.status = 'overdue';