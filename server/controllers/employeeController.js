// controllers/employeeController.js
import db from '../config/database.js';
import createHashPassword from '../middleware/hashPassword.js';

export const insertEmployee = async (req, res) => {
    const { em_id, name, role, branch_id, password, email, address, contactNo } = req.body;

    try {
        const hashPasskey = await createHashPassword(password);

        const insertEmployeeProcedure = `CALL insert_employee(?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [em_id, name, role, branch_id, hashPasskey, email, address, contactNo];

        db.query(insertEmployeeProcedure, params, (err, result) => {
            if (err) {
                console.error("Error calling procedure:", err);
                return res.status(500).send({ success: 0, error: "Employee insertion failed." });
            }
            console.log('Procedure result:', result);
            res.send({ success: 1 ,message:"employee added successfully"});
        });
    } catch (error) {
        console.error("Error inserting employee:", error);
        res.status(500).send({ success: 0, error: "Employee insertion failed." });
    }
};

export default { insertEmployee };
