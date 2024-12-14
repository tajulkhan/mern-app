import './App.css';
import SignIn from './components/sign-in';
import SignUp from './components/sign-up';
import Home from './components/pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { useState, useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []); // This is fine for checking token on initial load

  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <SignIn />} /> 
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
