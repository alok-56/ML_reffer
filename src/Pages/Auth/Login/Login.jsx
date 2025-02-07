import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import login from "../../../Assests/login.png";

import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // State variables for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleLogin = async () => {
    const credentials = { Email: email, Password: password };

    try {
      // Make API call
      const response = await fetch(
        "https://wallet-seven-fawn.vercel.app/api/v1/admin/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      console.log(data);
      if (data.status) {
        localStorage.setItem("token", data?.token);
        navigate("/");
      }

      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      {/* <div style={{ position: "absolute", left: 100, top: 10 }}>
        <img src={logo} alt="Logo" className="logo" />
      </div> */}

      <Container
        className="d-flex align-items-center justify-content-center login-inner-container"
        id="login-inner-container"
      >
        <Row
          className="d-flex align-items-center justify-content-center g-4"
          style={{ height: "100%" }}
        >
          <Col md={6} className="d-flex justify-content-center">
            <img
              style={{
                height: 600,
                transition: "transform 0.3s ease-in-out",
              }}
              src={login}
              alt="Login"
            />
          </Col>
          <Col md={6}>
            <div style={{ marginLeft: 30 }}>
              <h1 className="login-header">Login</h1>
              <p className="login-description">Login to access your account</p>

              {/* Email Input */}
              <div>
                <input
                  className="login-input"
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) =>
                    (e.target.style.boxShadow =
                      "0 0 5px rgba(0, 123, 255, 0.8)")
                  }
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
              </div>

              {/* Password Input */}
              <div className="mt-4">
                <input
                  className="login-input"
                  type="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) =>
                    (e.target.style.boxShadow =
                      "0 0 5px rgba(0, 123, 255, 0.8)")
                  }
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
              </div>

              {/* Error Message */}
              {error && <p className="error-message">{error}</p>}

              <p className="forgot-password" style={{ marginLeft: -10 }}>
                Forgot Password?
              </p>

              {/* Login Button */}
              <button
                className="btn mt-2"
                id="login-button"
                onClick={handleLogin}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                Login
              </button>

              <p className="mt-4" style={{ width: 400, textAlign: "center" }}>
                Or sign in with
              </p>

              <button
                className="btn mt-3"
                id="sign-in-button"
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                Facebook
              </button>

              <button
                className="btn mt-3"
                id="sign-in-button"
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                Google
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
