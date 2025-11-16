import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const data = {
      username: identifier,
      password: password,
    };

    try {
      const response = await axios.post("https://servered-dc3x.onrender.com/auth/signin", data);
      console.log("Login successful:", response.data);
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response) {
        setError(err.response.data.message || "Invalid credentials. Please try again.");
      } else {
        setError("Login failed. Please check your network connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Card */}
      <div className="w-full max-w-sm p-8 bg-emerald-50 rounded-xl shadow-lg border border-gray-200">
        
        {/* Title */}
        <h1 className="text-2xl font-semibold text-emerald-600 text-center mb-4">
          LokSahayak
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Login using your email or phone number.
        </p>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Phone number / email address"
            className="w-full px-3 py-2 rounded-md border border-gray-300 text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md font-medium transition-all disabled:bg-emerald-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <a href="#" className="hover:text-emerald-900">Forgot password?</a>
            <a href="#" className="hover:text-emerald-900">Sign up</a>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            By logging in, you agree to LokSahayak’s{" "}
            <a href="#" className="text-emerald-900 hover:underline">Terms</a>{" "}
            and{" "}
            <a href="#" className="text-emerald-900 hover:underline">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
