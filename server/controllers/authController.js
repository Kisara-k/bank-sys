// controllers/authController.js
import db from '../config/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const secretKey = 'yourSecretKey';

export const login = (req, res) => {
    const { username, passkey } = req.body;

    const individualQuery = `
        SELECT * FROM customer 
        JOIN individual_customer ON customer.customer_id = individual_customer.customer_id  
        JOIN account ON account.customer_id = customer.customer_id 
        WHERE customer.customer_id = ?
    `;

    db.query(individualQuery, [username], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: "Database error." });
        }

        if (result.length !== 0) {
            const user = result[0];
            const passwordMatch = await bcrypt.compare(passkey, user.hashed_password);
            
            if (passwordMatch) {
                const token = jwt.sign(
                    { userId: user.customer_id, role: 'customer' },
                    secretKey,
                    { expiresIn: '20m' }
                );
                return res.send({ token, result });
            } else {
                return res.status(401).send({ error: "Invalid credentials." });
            }
        } else {
            // Check for organization customer if individual customer does not exist
            const organizationQuery = `
                SELECT * FROM customer 
                JOIN organization_customer ON customer.customer_id = organization_customer.customer_id 
                JOIN account ON account.customer_id = customer.customer_id 
                WHERE customer.customer_id = ?
            `;
            db.query(organizationQuery, [username], async (err, result) => {
                if (err) {
                    console.error('Balance fetching error:', err);
                    return res.status(500).send({ error: "Database error." });
                }

                if (result.length !== 0) {
                    const user = result[0];
                    const passwordMatch = await bcrypt.compare(passkey, user.hashed_password);

                    if (passwordMatch) {
                        const token = jwt.sign(
                            { userId: user.customer_id, role: 'organization' },
                            secretKey,
                            { expiresIn: '20m' }
                        );
                        return res.send({ token, result });
                    } else {
                        return res.status(401).send({ error: "Invalid credentials." });
                    }
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
        WHERE employee_id = ?
    `;

    db.query(query, [employeeId], async (err, result) => {
        if (err) {
            console.error("Error getting data:", err);
            return res.status(500).send({ error: "Database error." });
        }

        if (result.length !== 0) {
            const user = result[0];
            const passwordMatch = await bcrypt.compare(employeepasskey, user.hashed_password);

            if (passwordMatch) {
                const token = jwt.sign(
                    { userId: user.employee_id, role: 'employee' },
                    secretKey,
                    { expiresIn: '20m' }
                );
                return res.send({ token, result });
            } else {
                return res.status(401).send({ error: "Invalid credentials." });
            }
        } else {
            return res.status(401).send({ error: "Invalid credentials." });
        }
    });
};

export default { login, employeeLogin };
