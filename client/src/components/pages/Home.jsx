import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  // Log out function to clear token and redirect to login
  const logOut = () => {
    console.log("Logging out...");
    sessionStorage.removeItem("authToken");  // Remove the token from sessionStorage

    // Using setTimeout to delay the redirection to login
    setTimeout(() => {
      navigate("/login");  // Redirect to login after a short delay
    }, 1000);  // 1 second delay (adjust as needed)
  };

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      navigate("/login");  // If no token, redirect to login
    } else {
      // Make a request to fetch user data or protected content
      axios
        .get("http://localhost:3001/protected", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setMessage(res.data.message))
        .catch((err) => {
          console.error("Error:", err);
          sessionStorage.removeItem("authToken");  // Clear invalid token
          navigate("/login");  // Redirect to login if token is invalid
        });
    }
  }, [navigate]);

  return (
    <div>
      <div>{message}</div>
      {/* Sign out button to log out */}
      <button
        className="bg-blue-500 hover:text-white text-white font-bold py-2 px-4 rounded"
        onClick={logOut}  // Use onClick for the button
      >
        Sign out
      </button>
    </div>
  );
}
