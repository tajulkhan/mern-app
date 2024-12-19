import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignIn from './components/sign-in';
import SignUp from './components/sign-up';
import Home from './components/pages/Home';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Define the routes using `createBrowserRouter`
  const router = createBrowserRouter([
    {
      path: "/",
      element: isAuthenticated ? <Home /> : <SignIn />,
    },
    {
      path: "/register",
      element: <SignUp />,
    },
    {
      path: "/login",
      element: <SignIn />,
    },
    {
      path: "/home",
      element: isAuthenticated ? <Home /> : <SignIn />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
