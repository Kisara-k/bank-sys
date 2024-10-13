// controllers/accountController.js
import db from '../config/database.js';

export const withdraw = (req, res) => {
    const { withdraw_amount, Acc_ID, Acc_type } = req.body;

    const withdrawProcedure = `CALL withdraw_money(?, ?, ?, @status_w)`;
    db.execute(withdrawProcedure, [withdraw_amount, Acc_ID, Acc_type], (err, result) => {
        if (err) {
            console.error("Error executing withdrawal:", err);
            return res.status(500).send({ success: 0, error: "Withdrawal failed." });
        }

        db.query("SELECT @status_w AS status", (err, result) => {
            if (err) {
                console.error("Error fetching status:", err);
                return res.status(500).send({ success: 0, error: "Withdrawal failed." });
            }

            const status = result[0].status;
            if (status === 1) {
                res.send({ success: 1 });
            } else {
                res.send({ success: 0 });
            }
        });
    });
};

export const deposit = (req, res) => {
    const { deposite_amount, Acc_ID, Acc_type } = req.body;

    const depositProcedure = `CALL deposit(?, ?, @status_d)`;
    db.execute(depositProcedure, [deposite_amount, Acc_ID], (err, result) => {
        if (err) {
            console.error("Error in deposit:", err);
            return res.status(500).send({ success: 0, error: "Deposit failed." });
        }

        db.query("SELECT @status_d AS status", (err, result) => {
            if (err) {
                console.error("Error fetching status:", err);
                return res.status(500).send({ success: 0, error: "Deposit failed." });
            }

            const status = result[0].status;
            if (status === 1) {
                res.send({ success: 1 });
            } else {
                res.send({ success: 0 });
            }
        });
    });
};

export const transfer = (req, res) => {
    const { from, to, amount, Acc_type } = req.body;

    const transferProcedure = `CALL transaction_money(?, ?, ?, ?, @status_p)`;
    db.execute(transferProcedure, [amount, from, to, Acc_type], (err, result) => {
        if (err) {
            console.error("Transaction error:", err);
            return res.status(500).send({ success: 0, error: "Transfer failed." });
        }

        db.query("SELECT @status_p AS status", (err, result) => {
            if (err) {
                console.error("Error fetching status:", err);
                return res.status(500).send({ success: 0, error: "Transfer failed." });
            }

            const status = result[0].status;
            if (status === 1) {
                res.send({ success: 1 });
            } else {
                res.send({ success: 0 });
            }
        });
    });
};

export default { withdraw, deposit, transfer };
