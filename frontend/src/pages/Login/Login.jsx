import React, { useState } from "react";
import Navbar from "../Header/Navbar.jsx";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import api from "../../services/GobalApi.js";
function Login() {
  const navigate = useNavigate(); // ✅ move inside component

  const [showPassword, setShowPassword] = useState(false);
  const [fromdata, Setfromdata] = useState({
    username: "",
    password: "",
  });

  const handleInput = (e) => {
    Setfromdata({
      ...fromdata,
      [e.target.name]: e.target.value,
    });
  };

  const LoginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/users/login",
        fromdata
      );

      console.log(response.data);

      //🔥store token
      const token = response.data.data.token;
      sessionStorage.setItem("token", token);

      //🔥store user
      sessionStorage.setItem("user", JSON.stringify(response.data.data.user));

      //🔥redirect
      navigate("/dashboard");

    } catch (error) {
      console.log(error.response?.data?.message);
      //alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-left">
          <h1>SmartSplit</h1>
          <p>Track and split expenses with your friends easily.</p>
        </div>

        <div className="login-right">
          <div className="login-card">
            <h2>Welcome Back</h2>

            <form onSubmit={LoginUser}>
              <div className="input-group">
                <input
                  type="text"
                  name="username"
                  onChange={handleInput}
                  required
                />
                <label>Username</label>
              </div>

              <div className="input-group password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  onChange={handleInput}
                />
                <label>Password</label>

                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁
                </span>
              </div>

              <button type="submit" className="login-btn">
                Login
              </button>
            </form>

            <p className="register-text">
              Don't have an account?{" "}
              <span>
                <Link to="/register" className="Register-btn">
                  Register
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
