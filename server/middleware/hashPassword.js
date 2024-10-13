// middleware/hashPassword.js
import { hash } from 'bcrypt';

const createHashPassword = async (planPassword) => {
    try {
        const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
        const hashedPassword = await hash(planPassword, saltRounds);
        return hashedPassword;
    } catch (err) {
        throw new Error("Error in hashing password: " + err.message);
    }
};

export default createHashPassword;
