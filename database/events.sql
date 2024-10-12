--------------update monthly withdrawals
CREATE EVENT reset_monthly_withdrawals
ON SCHEDULE EVERY 30 DAY
STARTS '2024-10-13 00:00:00' ON COMPLETION PRESERVE
ENABLE
DO 
    UPDATE saving_account
    SET monthly_withdrawals=5;

----------------update monthly rates
CREATE EVENT update_monthly_rates 
ON SCHEDULE EVERY 30 DAY 
STARTS '2024-10-13 00:00:00' ON COMPLETION PRESERVE 
ENABLE 
DO UPDATE account JOIN saving_account sa ON account.account_id=sa.account_id 
   join saving_account_plans sap on sap.plan_id=sa.plan_id
   SET account.balance=account.balance+(account.balance * (sap.interest_rate/100))