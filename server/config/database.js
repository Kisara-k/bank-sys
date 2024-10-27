// config/database.js
import { createConnection } from 'mysql2';

const db = createConnection({
    user: process.env.DB_USER || "root",
    host: process.env.DB_HOST || "localhost",
    password: process.env.DB_PASSWORD || "2001",
    database: process.env.DB_NAME || "boc",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to database.");
});

export default db;
