// loanController.js

import db from '../config/database.js'; // Ensure this path matches your project structure
import jwt from 'jsonwebtoken';

// Apply for a loan
export const applyLoan = (req, res) => {
    const { accountNo, loanAmount, duration, loanReason } = req.body;

    if (!accountNo || !loanAmount || !duration || !loanReason) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    let userId;
    try {
        const decodedToken = jwt.verify(token, 'yourSecretKey'); // Replace with your actual secret key
        userId = decodedToken.userId;
    } catch (err) {
        console.log('Invalid token:', err);
        return res.status(401).json({ message: 'Invalid token' });
    }

    db.query(
        'SELECT account.customer_id FROM account JOIN fixed_deposit ON fixed_deposit.account_id = account.account_id WHERE fixed_deposit.fd_id = ?',
        [accountNo],
        (error, results) => {
            if (error) {
                console.log('Database error:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (results.length === 0 || results[0].customer_id !== userId) {
                return res.status(403).json({ message: 'Unauthorized: Account owner mismatch' });
            }

            db.query(
                'CALL apply_online_loan(?, ?, ?, ?, @loan_status);',
                [accountNo, loanAmount, duration, loanReason],
                (error, result) => {
                    if (error) {
                        console.log('Error executing stored procedure:', error);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    db.query('SELECT @loan_status AS loan_status;', (err, results) => {
                        if (err) {
                            console.error('Error retrieving loan status:', err);
                            return res.status(500).json({ message: 'Internal server error' });
                        }

                        const loanStatus = results[0].loan_status;
                        res.status(200).json({ message: loanStatus });
                    });
                }
            );
        }
    );
};

export const applyPhysicalLoan = (req, res) => {
    const { acc_no, amount, duration, date, reason } = req.body; // Destructure loan data from request

    const sql = `CALL physical_loan(?,?,?,?,?,@loan_state)`; // Call to stored procedure

    db.execute(sql, [amount, acc_no, duration, date, reason], (err, result) => {
        if (err) {
            console.error("Procedure error:", err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        console.log("Procedure result:", result);

        // Retrieve the output parameter `@loan_state` from the procedure
        db.query("SELECT @loan_state AS state", (err, result) => {
            if (err) {
                console.error("Error fetching loan status:", err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            const status = result[0].state;
            res.json({ success: 1, status }); // Send status and success response
            console.log("Loan application success:", { status });
        });
    });
};

// Fetch all loans by type
export const getLoansByType = (req, res) => {
    const type = req.body.type;

    let query = '';
    if (type === '1') query = 'SELECT * FROM loans WHERE type="online"';
    else if (type === '2') query = 'SELECT * FROM loans WHERE type="physical"';
    else if (type === '3') query = 'SELECT * FROM loans WHERE type="physical" AND status="pending"';

    db.query(query, (err, result) => {
        if (err) {
            console.log('Error getting loan details:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(result);
    });
};

// Approve loan
export const approveLoan = (req, res) => {
    const { loan_id } = req.body;

    db.query(
        'SELECT * FROM loans WHERE loan_id = ? AND type="physical" AND status="pending"',
        [loan_id],
        (err, result) => {
            if (err) {
                console.log('Error executing query:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.json(result);
        }
    );
};

// Manager approves a loan
export const managerApproveLoan = (req, res) => {
    const { loan_id, acc_id, manager_id } = req.body;

    db.query('CALL approve_loan(?, ?, ?, @status)', [acc_id, loan_id, manager_id], (err, result) => {
        if (err) {
            console.log('Error in procedure call:', err);
            return res.status(500).json({ message: 'Loan approval error' });
        }

        db.query('SELECT @status AS status', (err, results) => {
            if (err) {
                console.log('Error fetching status:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            const status = results[0].status;
            if (status === 1) {
                res.json({ success: 1, message: 'Loan approval completed' });
            } else {
                res.json({ success: 0, message: 'Loan approval failed' });
            }
        });
    });
};

// Manager rejects a loan
export const managerRejectLoan = (req, res) => {
    const { loan_id, manager_id, acc_id } = req.body;

    db.query('CALL reject_loan(?, ?, ?, @status)', [loan_id, manager_id, acc_id], (err, result) => {
        if (err) {
            console.log('Error in procedure call:', err);
            return res.status(500).json({ message: 'Loan rejection error' });
        }

        db.query('SELECT @status AS status', (err, results) => {
            if (err) {
                console.log('Error fetching status:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            const status = results[0].status;
            if (status === 1) {
                res.json({ success: 1, message: 'Loan rejection completed' });
            } else {
                res.json({ success: 0, message: 'Loan rejection failed' });
            }
        });
    });
};

// Get user loans with installments
export const getUserLoans = (req, res) => {
    const { customer_id } = req.query;

    db.query('SELECT * FROM loans WHERE customer_id = ?', [customer_id], (err, loans) => {
        if (err) {
            console.log('Error fetching loan details:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        const loansWithInstallments = loans.map((loan) => {
            const installments = db.query(
                'SELECT * FROM installments WHERE loan_id = ?',
                [loan.loan_id]
            );
            return { ...loan, installments };
        });

        res.json(loansWithInstallments);
    });
};

// Pay installment
export const payInstallment = (req, res) => {
    const { loan_id, installmentId } = req.params;

    db.query('CALL PayInstallment(?, ?, @process)', [loan_id, installmentId], (err) => {
        if (err) {
            console.error('Error executing payment procedure:', err);
            return res.status(500).json({ error: 'Insufficient funds for installment payment' });
        }

        db.query('SELECT @process AS answer', (err, results) => {
            if (err) {
                console.error('Error fetching process result:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            const result = results[0].answer;
            if (result === 1) {
                res.json({ message: 'Payment successful' });
            } else {
                res.status(400).json({ error: 'Payment could not be processed' });
            }
        });
    });
};


export const getDueInstallments = (req, res) => {
    const { customer_id } = req.params; // Extract customer_id from route parameters
    console.log(`Fetching due installments for customer_id: ${customer_id}`);

    const sql = 'CALL get_due_installments(?)'; // Replace with your stored procedure name if different

    db.query(sql, [customer_id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // The first result set contains the due installments
        const installments = results[0]; // Access first result set from the stored procedure
        console.log('Due installments:', installments);

        // Check if installments is an array and respond accordingly
        if (Array.isArray(installments) && installments.length > 0) {
            res.json(installments);
        } else {
            res.status(404).json({ error: 'No due installments found' });
        }
    });
};


export const getLoansByAccountId = (req, res) => {
    const { accountId } = req.body; // Destructure accountId from request body

    db.query('SELECT * FROM loans WHERE account_id = ?', [accountId], (error, results) => {
        if (error) {
            console.error('Error fetching loan data:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results); // Send results as JSON response
    });
};
