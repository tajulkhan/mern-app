/* eslint-disable react/no-unknown-property */
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = (event) => {
    event.preventDefault();
    
    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }
    
    console.log("Attempting login with password:", password);  // Debugging line
    
    axios
      .post("https://mern-app-1-ukvv.onrender.com/login", { email, password })
      // .post("http://localhost:3001/login", { email, password })
      .then((res) => {
        if (res.data.success) {
          sessionStorage.setItem("authToken", res.data.token);
          navigate("/home");
        } else {
          alert("Login failed: " + res.data.message);
        }
      })
      .catch((err) => {
        console.error("Error during login:", err.response ? err.response.data : err.message);
        alert("Login failed. Please check your credentials.");
      });
  };
  useEffect(() => {
    // If the user is already authenticated, redirect to home page
    const token = sessionStorage.getItem("authToken");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);
  
  return (
    <>
      <div className="flex min-h-full rounded-lg border border-gray-300 flex-1 flex-col justify-center px-6 py-4 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-4 w-64">
            <div>
              <label
                htmlFor="email"
                className="block text-start text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-green-700 hover:text-green-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-700 px-3 py-1.5 text-sm/6 font-semibold hover:border-1 hover:border-green-500 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Create new account?{" "}
            <Link
              to="/register"
              className="font-semibold text-green-700 hover:text-green-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
