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
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
