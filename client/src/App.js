import './App.css';
import {BrowserRouter as Router,Route,Switch,Link,Routes} from 'react-router-dom';
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
import LoanApprove from './pages/LoanApprove';
import NicDetail from './pages/NicDetail';
import RegDetail from './pages/RegDetail';
import LoanInstallments from './pages/LoanInstallments';

import ATMProfile from './pages/ATMProfile'; // Import the ATMProfile component
import Deposit from './pages/Deposit'; // Import the Deposit component
import Withdraw from './pages/Withdraw';


function App() {
  return (
    <>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/account" element={<Account/>}></Route>
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="/profileo" element={<Profileo/>}></Route>
          <Route path="/FD" element={<Fixeddeposite/>}></Route>
          <Route path="/loans" element={<Loans/>}></Route>
          <Route path="/bmslogin" element={<Bmslogin/>}></Route>
          <Route path="/BMS" element={<Bms/>}></Route>
          <Route path='/branch_transaction' element={<BranchReport/>}></Route>
          <Route path='/apply-loan' element={<Loans/>}></Route>
          <Route path='/late_loan' element={<Lateloan/>}></Route>


          <Route path="/loans" element={<Loans />} />
          <Route path="/loan-status" element={<LoanStatus />} />

          <Route path='/loanManage' element={<LoanApprove/>}></Route>
          <Route path='/NicDetail' element={<NicDetail/>}></Route>
          <Route path='/RegDetail' element={<RegDetail/>}></Route>


          <Route path='/loanManage' element={<LoanApprove/>}></Route>
          <Route path='/NicDetail' element={<NicDetail/>}></Route>
          <Route path='/RegDetail' element={<RegDetail/>}></Route>
          <Route path='/loan-installments' element={<LoanInstallments/>}></Route>

          <Route path="/atm" element={<ATMProfile/>} /> {/* Add route for ATMProfile */}
          <Route path="/deposit" element={<Deposit />} /> {/* Add route for Deposit */}
          <Route path="/withdraw" element={<Withdraw />} /> {/* Add route for Withdraw */}

        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
