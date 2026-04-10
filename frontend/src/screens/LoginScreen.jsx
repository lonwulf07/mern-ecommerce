import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCredentials } from "../slices/authSlice";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useLocation lets us read the URL. If they came from the Cart, we want to
  // send them straight to Shipping after they log in.
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  // Get user info from Redux to see if they are ALREADY logged in
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // If they are already logged in, redirect them so they don't see the login page
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing on form submit
    try {
      // Send the login request to our Node/Express backend
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });

      // If successful, save the user info (and JWT token) to Redux
      dispatch(setCredentials(data));
      navigate(redirect);
    } catch (error) {
      // If wrong password, alert the user
      alert(error.response?.data?.message || "Failed to log in");
    }
  };

  return (
    <Row className="justify-content-md-center">
      <Col xs={12} md={6}>
        <h1>Sign In</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="my-2" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3">
            Sign In
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            New Customer?{" "}
            {/* If they click register, remember where they originally wanted to go */}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              Register Here
            </Link>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default LoginScreen;
