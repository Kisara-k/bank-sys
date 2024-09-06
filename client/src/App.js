import './App.css';
import {BrowserRouter as Router,Route,Switch,Link,Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Account from './pages/Account';

function App() {
  return (
    <>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/account" element={<Account/>}></Route>
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
