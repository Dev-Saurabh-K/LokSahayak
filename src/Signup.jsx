import React, { useState } from "react";
import axios from "axios"; // 1. Import axios
import { useNavigate, Link } from "react-router-dom"; // 2. Import router hooks

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  // 3. Add state for all form inputs
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState(""); // For phone/email
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("English"); // Default value

  // 4. Add state for loading and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 5. Initialize the navigate function for redirection
  const navigate = useNavigate();

  // 6. Create the function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page refresh
    setLoading(true);
    setError("");

    const signupData = {
      fullName: fullName,
      username: username,
      password: password,
      language: language,
    };

    try {
      // 7. Make the POST request
      //    !!!! IMPORTANT: Change '/api/v1/signup' to your actual API endpoint !!!!
      const response = await axios.post("http://localhost:3000/auth/signup", signupData);

      // 8. Auto-Login: Handle the successful response (same as login)
      //    We assume the server sends back a token on successful signup
      const { token } = response.data;
      
      // Save the token
      localStorage.setItem("token", token);
      
      // Set token for all future axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Redirect to the dashboard
      navigate("/dashboard");

    } catch (err) {
      // 9. Handle errors
      console.error("Signup failed:", err);
      if (err.response && err.response.data) {
        // Server sent a specific error message
        setError(err.response.data.message || "Signup failed. Please try again.");
      } else {
        // Network or other error
        setError("An error occurred. Please check your network and try again.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-emerald-50 to-emerald-100 px-4 py-6">
      {/* App Title outside the card */}
      <h1 className="text-4xl font-extrabold text-emerald-700 mb-6 drop-shadow-sm">
        LokSahayak
      </h1>

      {/* Card */}
      <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-xl border border-emerald-200">
        {/* Subtitle */}
        <h2 className="text-2xl font-semibold text-emerald-600 text-center mb-1">
          Create Account
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Fill the details to get started
        </p>

        {/* 10. Hook up the form's onSubmit event */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          {/* 11. Show error message if it exists */}
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-800
            focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none shadow-sm"
            // 12. Connect all inputs to state
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          {/* Username */}
          <input
            type="text"
            placeholder="Username (no spaces)"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-800
            focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none shadow-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Email / Phone */}
          <input
            type="text"
            placeholder="Phone number / Email"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-800
            focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none shadow-sm"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-800
              focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none shadow-sm"
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

          {/* Language Preference */}
          <select
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800
            focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none shadow-sm cursor-pointer"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
            <option>Tamil</option>
            <option>Telugu</option>
            <option>Gujarati</option>
            <option>Kannada</option>
            <option>Bengali</option>
            <option>Punjabi</option>
            <option>Urdu</option>
          </select>

          {/* Terms & Conditions */}
          <p className="text-xs text-gray-500 text-center mt-2 leading-relaxed">
            By creating an account, you agree to LokSahayak’s{" "}
            <a href="#" className="text-emerald-500 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-emerald-500 hover:underline">
              Privacy Policy
            </a>
            .
            <br />
            <span className="font-medium text-gray-600">
              Your information will remain completely confidential and secure
              with us.
            </span>
          </p>

          {/* Submit Button at the bottom */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg
            font-medium transition-all shadow-md hover:shadow-lg mt-4 disabled:bg-emerald-400 disabled:cursor-not-allowed"
            // 13. Disable button while loading
            disabled={loading}
          >
            {/* 14. Show loading text */}
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Login Redirect */}
          <p className="text-sm text-gray-600 text-center mt-2">
            Already have an account?{" "}
            {/* 15. Use <Link> for internal navigation */}
            <Link
              to="/login"
              className="text-emerald-600 hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}