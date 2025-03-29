import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import axios from "axios";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [cookies, setCookie] = useCookies(["jwt"]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const pageStyle = {
        display: "flex",
        height: "100vh",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        background: "rgb(236, 236, 238)",
        overflow: "hidden",
        fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
    };
    
    useEffect(() => {

      console.log("Cookies:", cookies.jwt); // Debugging
    
      if (loading) {
        setTimeout(() => setLoading(false), 100); // Delay checking cookies
        return;
      }
    
      if (cookies.jwt) {
        navigate("/home");
      }
    }, []);


  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8080/login",
        {
          ...values,
        },
        { withCredentials: true }
      );
      if (data) {
        if (data.errors) {
          const { email, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={pageStyle}>
      <div className="logincontainer">
        <h2>Login Account</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            />
          </div>
          <button type="submit">Submit</button>
          <span>
            Create an Account?!<Link to="/"> Register</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginPage;
