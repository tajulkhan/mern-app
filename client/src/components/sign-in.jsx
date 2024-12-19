import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoadingPopup, setIsLoadingPopup] = useState(false);
  const navigate = useNavigate();

  // const apiUrl = "http://localhost:3001"; // Change this if using production API
  const apiUrl = "https://mern-app-1-ukvv.onrender.com";


  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }
    setIsLoadingPopup(true); // Show loader popup

    try {
      const res = await axios.post(`${apiUrl}/login`, { email, password });
      setIsLoadingPopup(false); // Hide loader popup after response
      if (res.data.success) {
        // Store token in localStorage
        localStorage.setItem("authToken", res.data.token);

        // Redirect to home page
        navigate("/home", { replace: true });
      } else {
        alert("Login failed: " + res.data.message);
      }
    } catch (err) {
      setIsLoadingPopup(false); // Hide loader popup on error
      console.error("Error during login:", err.response ? err.response.data : err.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // If a token exists, navigate to home page immediately
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-full rounded-lg border border-gray-300 flex-1 flex-col justify-center px-6 py-4 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-4 w-64">
          {/* Email input */}
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

          {/* Password input */}
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

          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-green-700 px-3 py-1.5 text-sm/6 font-semibold hover:border-1 hover:border-green-500 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
            >
              Login
            </button>
          </div>
        </form>

        {/* Link to register page */}
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

      {/* Loader Popup */}
      {isLoadingPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-md">
            <div className="flex justify-center items-center space-x-2">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              ></div>
              <span className="text-lg text-gray-800">Loading...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
