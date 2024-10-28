// controllers/authController.js
import db from '../config/database.js';
import jwt from 'jsonwebtoken';

const secretKey = 'yourSecretKey';
export const login = (req, res) => {
    const { username, passkey } = req.body;

    const individualQuery = `
        SELECT * FROM customer 
        JOIN individual_customer ON customer.customer_id = individual_customer.customer_id  
        JOIN account ON account.customer_id = customer.customer_id 
        WHERE customer.customer_id = ? AND hashed_password = ?
    `;

    db.query(individualQuery, [username, passkey], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: "Database error." });
        }

        if (result.length !== 0) {
            const user = result[0];
            const token = jwt.sign(
                { userId: user.customer_id, role: 'customer' },
                secretKey,
                { expiresIn: '20m' }
            );
            return res.send({ token, result });
        } else {
            const organizationQuery = `
                SELECT * FROM customer 
                JOIN organization_customer ON customer.customer_id = organization_customer.customer_id 
                JOIN account ON account.customer_id = customer.customer_id 
                WHERE customer.customer_id = ? AND hashed_password = ?
            `;
            db.query(organizationQuery, [username, passkey], (err, result) => {
                if (err) {
                    console.error('Balance fetching error:', err);
                    return res.status(500).send({ error: "Database error." });
                }

                if (result.length !== 0) {
                    const user = result[0];
                    const token = jwt.sign(
                        { userId: user.customer_id, role: 'organization' },
                        secretKey,
                        { expiresIn: '20m' }
                    );
                    console.log(result[0].balance);
                    return res.send({ token, result });
                } else {
                    return res.status(401).send({ error: "Invalid credentials." });
                }
            });
        }
    });
};

export const employeeLogin = (req, res) => {
    const { employeeId, employeepasskey } = req.body;

    const query = `
        SELECT * FROM employees 
        WHERE employee_id = ? AND hashed_password = ?
    `;

    db.query(query, [employeeId, employeepasskey], (err, result) => {
        if (err) {
            console.error("Error getting data:", err);
            return res.status(500).send({ error: "Database error." });
        }

        if (result.length !== 0) {
            const user = result[0];
                    const token = jwt.sign(
                        { userId: user.customer_id, role: 'organization' },
                        secretKey,
                        { expiresIn: '20000m' }
                    );
            console.log("Success");
            return res.send({ token, result });
        } else {
            return res.status(401).send({ error: "Invalid credentials." });
        }
    });
};

export default { login, employeeLogin };