import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import login from "../../../Assests/login.png";
import logo from "../../../Assests/logo.png";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { LoginApi } from "../../../Api/Auth";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Loader from "../../../Components/Loading/Loading";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true)
    const credentials = { Email: email, Password: password };
    try {
      let res = await LoginApi(credentials);
      if (res.status) {
        Cookies.set("token", res.token, { expires: 5 / 24 });
        Swal.fire({
          title: "Success!",
          text: "Login successfully..",
          icon: "success",
        });
        navigate("/");
      } else {
        Swal.fire({
          title: "Error!",
          text: res.message,
          icon: "error",
        });
      }
    } catch (error) {
      setError(error.message);
    } finally{
      setLoading(false)
    }
  };

  return (
    <div className="login-container">
      {loading && <Loader></Loader>}
      <Container className="login-inner-container" fluid>
        <Row className="align-items-center justify-content-center g-4">
          <Col
            xs={12}
            md={6}
            style={{ height: 550 }}
            className="text-center d-none d-md-block"
          >
            <img className="login-image " src={login} alt="Login" />
          </Col>
          <Col xs={12} md={6} className="login-form-container text-center">
            <Col xs={12} className="text-center">
              <h3>Company Logo</h3>
            </Col>
            <h1 className="login-header">Login</h1>
            <p className="login-description">Login to access your account</p>
            <input
              className="login-input w-100"
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="login-input mt-3 w-100"
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>}
            <button className="login-button w-100" onClick={handleLogin}>
              Login
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
