// controllers/customerController.js
import db from '../config/database.js';
import createHashPassword from '../middleware/hashPassword.js';
import generateUnique10DigitNumber from '../utils/generateCustomID.js';
import generateUnique8DigitNumber from '../utils/generateAccountID.js';
import calculateSavingPlan from '../utils/savingPlans.js';

export const createAccount = async (req, res) => {
    const {
        fname, lname, Bday, nic, contactNo, email,
        address, password, Acctype, Amount, Date,
        customer_type, branch_id, reg_no, contPerson,
        position
    } = req.body;

    try {
        const hashpassword = await createHashPassword(password);
        const customer_ID = generateUnique10DigitNumber();
        const acc_ID = generateUnique8DigitNumber();
        const plan_id = calculateSavingPlan(Bday);

        let addCustomerProcedure = `CALL create_account(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let params;

        if (customer_type === "individual") {
            params = [
                customer_ID, customer_type, contactNo, hashpassword, email, address,
                fname, lname, Bday, nic, acc_ID, branch_id, Acctype,
                Amount, Date, "", "", "", "", plan_id
            ];
        } else {
            params = [
                customer_ID, customer_type, contactNo, hashpassword, email, address,
                "", "", null, "", acc_ID, branch_id, Acctype,
                Amount, Date, fname, reg_no, contPerson, position, plan_id
            ];
        }

        db.query(addCustomerProcedure, params, (err, result) => {
            if (err) {
                console.error("Error calling procedure:", err);
                return res.status(500).send({ success: 0, error: "Account creation failed." });
            }
            console.log('Procedure result:', result);
            res.send({ success: 1 });
        });
    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).send({ success: 0, error: "Account creation failed." });
    }
};

export default { createAccount };
