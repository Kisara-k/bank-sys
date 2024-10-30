# Bank Management System

This project is a Bank Management System (BMS) that allows users to manage their bank accounts, apply for loans, and make installment payments. The system is built using a combination of React for the frontend and Node.js with Express for the backend. The database is managed using MySQL.

- Developed as part of Semester 3 `CS3043` `Database Systems` module.

## Features

### Account Management

- Supports Savings and Checking accounts.
- Enables Fixed Deposit (FD) setup with annual interest rates.
- Implements account restrictions based on account type (e.g., withdrawal limits, minimum balance).

### Fund Transfers and Withdrawals

- Allows customers to make same-bank fund transfers through an online portal.
- Enables ATM withdrawals for Savings and Checking account holders.

### Loan Processing

- Supports Business and Personal Loan Applications:
  - Branch Loans: Initiated and managed by bank employees.
  - Online Loans: Self-application for customers with Fixed Deposits (FDs) to borrow up to 60% of the FD value (max 500,000).
- Calculates monthly installments based on loan amount, interest rate, and duration.

### Reporting

- Branch-wise reports on total transactions and late loan installments viewable by branch managers.

## Tech Stack

- **Frontend**: React, Axios
- **Backend**: Node.js with Express, MySQL 
- **Database**: SQL, with emphasis on ACID compliance, primary and foreign keys, and indexing.

## Getting Started

To get started with the Bank Management System, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/Kisara-k/bank-sys.git
    cd bank-sys
    ```

2. **Install backend dependencies**:
    ```sh
    npm install
    ```

3. **Install frontend dependencies**:
    ```sh
    cd client
    npm install
    cd ..
    ```

4. **Set up the database**:
    - Create a MySQL database and import the provided SQL schema file.
    - Update the database configuration in `server/config/database.js` with your database credentials.

5. **Start the backend server**:
    ```sh
    npm run server
    ```

6. **Start the frontend development server**:
    ```sh
    cd client
    npm start
    ```

7. **Open the application**:
    - Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.


      

![WhatsApp Image 2024-10-30 at 08 52 27](https://github.com/user-attachments/assets/8f32242e-de13-4a41-a5f4-ca4813e32a71)


![WhatsApp Image 2024-10-30 at 08 52 41](https://github.com/user-attachments/assets/e0a3b0fe-51cf-4775-a95b-14e031eb6fcd)
