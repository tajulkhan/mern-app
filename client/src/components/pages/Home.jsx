import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [name, setName]=useState("");
  const apiUrl = "http://localhost:3001";
  // const apiUrl = "https://mern-app-1-ukvv.onrender.com";
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
        // .get("https://mern-app-1-ukvv.onrender.com/protected", {
        .get(`${apiUrl}/protected`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setMessage(res.data.message);
          setName(res.data.userName);
        })
        .catch((err) => {
          console.error("Error:", err);
          sessionStorage.removeItem("authToken");
          navigate("/login");
        });
    }
  }, [navigate]);

  return (
    <div className="bg-gray-50 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
      <div className="text-center mb-8">
        <h4 className="text-3xl font-semibold text-indigo-600">
          Welcome, {name}!
        </h4>
        <p className="text-lg text-gray-600 mt-2">
          {message}
        </p>
      </div>

      <div className="mt-6">

        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
            onClick={logOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}
