import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Use Vite environment variables correctly
  // const apiUrl = import.meta.env.MONGO_URI || "http://localhost:3001";
  const apiUrl = "https://mern-app-1-ukvv.onrender.com";


  // Handle the login form submission
  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${apiUrl}/login`, { email, password });
      setIsLoading(false);

      if (res.data.success) {
        // Store token in sessionStorage and immediately navigate
        sessionStorage.setItem("authToken", res.data.token);
        navigate("/home", { replace: true }); // Redirect to home page immediately after successful login
      } else {
        alert("Login failed: " + res.data.message);
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Error during login:", err.response ? err.response.data : err.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  // Check if the user is already authenticated when the component mounts
  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      // If a token exists, navigate to home page immediately
      navigate("/home", { replace: true });
    }
  }, [navigate]); // Dependency array ensures this runs only once when the component mounts

  return (
    <div className="flex min-h-full rounded-lg border border-gray-300 flex-1 flex-col justify-center px-6 py-4 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in</h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-4 w-64">
          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-start text-sm/6 font-medium text-gray-900">
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
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-green-700 hover:text-green-500">
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
              disabled={isLoading}
              type="submit"
              className="flex w-full justify-center rounded-md bg-green-700 px-3 py-1.5 text-sm/6 font-semibold hover:border-1 hover:border-green-500 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="none" d="M4 12a8 8 0 118 8 8 8 0 01-8-8zm12 0a8 8 0 11-8 8 8 8 0 018-8z" />
                  </svg>
                  Processing...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        {/* Link to register page */}
        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Create new account?{" "}
          <Link to="/register" className="font-semibold text-green-700 hover:text-green-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
