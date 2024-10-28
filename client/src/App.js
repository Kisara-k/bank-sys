import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Account from './pages/Account';
import Profile from './pages/Profile';
import Profileo from './pages/Profileo';
import Fixeddeposite from './pages/Fixeddeposite';
import Loans from './pages/Loans';
import Bmslogin from './pages/Bmslogin';
import Bms from './pages/Bms';
import BranchReport from './pages/BranchReport';
import Lateloan from './pages/Lateloan';
import LoanStatus from './pages/loanstatus';
// import AccountList from './pages/AccountList'; // Import the AccountList component
import ATMProfile from './pages/ATMProfile'; // Import the ATMProfile component
import Deposit from './pages/Deposit'; // Import the Deposit component
import Withdraw from './pages/Withdraw'; // Import the Withdraw component

function App() {
  const customerId = '100001'; // Example customer ID, replace with actual logic to get logged-in customer ID

  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profileo" element={<Profileo />} />
            <Route path="/FD" element={<Fixeddeposite />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/bmslogin" element={<Bmslogin />} />
            <Route path="/BMS" element={<Bms />} />
            <Route path='/branch_transaction' element={<BranchReport />} />
            <Route path='/apply-loan' element={<Loans />} />
            <Route path='/late_loan' element={<Lateloan />} />
            <Route path="/loan-status" element={<LoanStatus customerId={customerId} />} />
            {/* <Route path="/account-list" element={<AccountList />} /> */} {/* Commented out AccountList route */}
            <Route path="/atm" element={<ATMProfile />} /> {/* Add route for ATMProfile */}
            <Route path="/deposit" element={<Deposit />} /> {/* Add route for Deposit */}
            <Route path="/withdraw" element={<Withdraw />} /> {/* Add route for Withdraw */}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;