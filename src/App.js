import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Books';
import Users from './components/Users';
import { useState } from 'react';
import UserPage from './components/UserPage';


function App() {
  // State pour verifier si la personne est authentifié ou pas 
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  return (
    // Les Routes 
    <Router>
      <div className="container-fluid">
        <Routes> 
          <Route path='/' element={<Register setIsAuthenticated={setIsAuthenticated} />} />
          <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated}/>} />
          <Route path='/users' element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
          <Route path='/dashboard' element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path='/userpage' element={isAuthenticated ? <UserPage  /> : <Navigate to="/login" />} />
        </Routes>
    </div>
    </Router>
    
  );
}

export default App;
