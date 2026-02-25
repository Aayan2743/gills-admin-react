import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const success = login(email, password);
  //   if (success) navigate("/dashboard");
  //   else setError("Invalid email or password");
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const success = await login(username, password);
    console.log("success", success);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT – FORM */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
          <p className="text-gray-500 mt-1">
            Enter your email and password to sign in!
          </p>

          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-100 p-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="info@gmail.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-400 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded" />
                Keep me logged in
              </label>

              <a href="#" className="text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              Sign in
            </button>
          </form>

          {/* Footer */}
        </div>
      </div>

      {/* RIGHT – BRAND */}
      <div className="hidden md:flex items-center justify-center bg-[#7C96FF] relative">
        <div className="text-center text-white">
          {/* LOGO */}
          <img
            src="./logo/Gil-Logo.svg" // replace with your logo
            alt="GIL Logo"
            className="mx-auto w-[20rem] mb-6"
          />

          <h1 className="text-2xl font-semibold tracking-wide">
            GEMTECH INTERNATIONAL
          </h1>
          <p className="mt-1 tracking-widest text-sm">LABORATORIES</p>

          <p className="mt-6 text-sm opacity-80">Gills Lab Admin Dashboard</p>
        </div>
      </div>
    </div>
  );
}
