import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const logOut = () => {
    console.log("Logging out...");
    sessionStorage.removeItem("authToken");  

    setTimeout(() => {
      navigate("/login");  
    }, 1000);  
  };

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      navigate("/login");  
    } else {
      axios
        .get("https://mern-app-1-ukvv.onrender.com/protected", {
        // .get("http://localhost:3001/protected", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setMessage(res.data.message))
        .catch((err) => {
          console.error("Error:", err);
          sessionStorage.removeItem("authToken");  
          navigate("/login");  
        });
    }
  }, [navigate]);

  return (
    <div>
      <div>{message}</div>
      <button
        className="bg-blue-500 hover:text-white text-white font-bold py-2 px-4 rounded"
        onClick={logOut}  
      >
        Sign out
      </button>
    </div>
  );
}
