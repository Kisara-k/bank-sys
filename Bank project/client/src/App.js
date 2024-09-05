import './App.css';
import {BrowserRouter as Router,Route,Switch,Link,Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Account from './pages/Account';
import Branches from './pages/Branches';
import Loanplans from './pages/Loanplans';
import Contact from './pages/Contact';

function App() {
  return (
    <>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/account" element={<Account/>}></Route>
          <Route path="/branches" element={<Branches/>}></Route>
          <Route path="/loans" element={<Loanplans/>}></Route>
          <Route path="/contact" element={<Contact/>}></Route>
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
