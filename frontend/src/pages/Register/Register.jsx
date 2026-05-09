import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import Navbar from "../Header/Navbar.jsx";
import { Link,useNavigate } from "react-router-dom";

function Register() {

  const[fromData,SetfromData] = useState({
    username:"",
    email:"",
    password:"",
    upiId:""
  });

  const handleInput =   (e)=>{
     SetfromData({
      ...fromData,
      [e.target.name] : e.target.value
     });
      };
 const navigate = useNavigate();
  const RegisterUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/users/register",
        fromData
      );
      console.log(response.data);

      // ✅ redirect after successful register
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };
 

  return (
    <>
         <Navbar/>
         <div className="register-page">
      <div className="register-card">

        <h2>Create Account</h2>
        <p className="subtitle">Start splitting expenses with your friends</p>

        <form onSubmit={RegisterUser}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input-field"
            onChange={handleInput}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input-field"
            onChange={handleInput}
          />

          <input
            type="password"
            name = "password"
            placeholder="Password"
            className="input-field"
            onChange={handleInput}
          />
          <input
            type="text"
            name = "upiId"
            placeholder="upi Id"
            className="input-field"
            onChange={handleInput}
          />
          {/* <span> > */}
          <button type = "submit" className="register-btn">
       
            Create Account
          
          </button>
         

        </form>

        <p className="login-text">
          Already have an account? <span><Link to = "/login" className="Login-btn">Login</Link></span>
        </p>

      </div>
    </div>
    </>

  );
}

export default Register;