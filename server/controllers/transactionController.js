// controllers/transactionController.js
import db from '../config/database.js';

export const getTransactionDetails = (req, res) => {
    const { Id } = req.query;

    const transactionsQuery = "SELECT * FROM transaction_log WHERE account_id = ?";
    const balanceQuery = "SELECT balance FROM account WHERE account_id = ?";

    Promise.all([
        new Promise((resolve, reject) => {
            db.query(transactionsQuery, [Id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        }),
        new Promise((resolve, reject) => {
            db.query(balanceQuery, [Id], (err, result) => {
                if (err) return reject(err);
                resolve(result.length > 0 ? result[0].balance : null);
            });
        })
    ])
    .then(([transactionDetails, balance]) => {
        res.send({ transactions: transactionDetails, balance: balance });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send({ error: "An error occurred while fetching transaction details." });
    });
};

export const getTransactionReport = (req, res) => {
    const { branch_id ,report} = req.body;

    if(report==="1"){
        const transReportProcedure = `CALL transaction_report(?)`;
        db.execute(transReportProcedure, [branch_id], (err, result) => {
        if (err) {
            console.error("Procedure call error:", err);
            return res.status(500).send({ error: "Transaction report generation failed." });
        }
        console.log(result);
        res.send(result);
    });
    }else{
        const transReportProcedure = `CALL late_loan_installments(?)`;
        db.execute(transReportProcedure, [branch_id], (err, result) => {
        if (err) {
            console.error("Procedure call error:", err);
            return res.status(500).send({ error: "Late loan report generation failed." });
        }
        console.log(result);
        res.send(result);

        });
    }
    
};

export const fixDeposit = (req, res) => {
    console.log("sari");
    const { acc_id, plan, date, amount, acc_type } = req.body;

    console.log(acc_id, plan, date, amount, acc_type);

    const startFDProcedure = `CALL insert_into_fixed_deposit(?, ?, ?, ?,?, @status_f)`;
    db.query(startFDProcedure, [amount, acc_id, acc_type, plan, date], (err, result) => {
        if (err) {
            console.error("Fixed deposit creation error:", err);
            return res.status(500).send({ success: 2, error: "Fixed deposit creation failed." });
        }

        db.query("SELECT @status_f AS status", (err, result) => {
            if (err) {
                console.error("Error fetching status:", err);
                return res.status(500).send({ success: 0, error: "Fixed deposit creation failed." });
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

export default { getTransactionDetails, getTransactionReport, fixDeposit };
