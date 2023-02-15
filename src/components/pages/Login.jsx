import { useState } from "react";
import axios from "axios";
import jwt_decode from 'jwt-decode';

const Login = ({ onClose, onLogin, setCurrentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}`, {
        email,
        password,
      });

      // set the token in local storage
      localStorage.setItem("jwt", response.data.token);

      // decode the token to get the user data
      const decodedToken = jwt_decode(response.data.token);

      // set the user data in App state
      setCurrentUser(decodedToken);

      // call the onLogin function passed in as a prop
      onLogin();

      // close the login modal
      onClose();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("Invalid email or password");
      } else {
        setErrorMessage("An unknown error occurred");
      }
    }
  };

  return (
    <div className="login">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
