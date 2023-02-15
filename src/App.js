import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

// component imports
import Home from "./components/pages/Home";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import Profile from "./components/pages/Profile";
import Navbar from "./components/Navbar";
import Welcome from "./components/pages/Welcome";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

function App() {
  // the currently logged in user will be stored up here in state
  const [currentUser, setCurrentUser] = useState(null);

  // useEffect -- if the user navigates away form the page, we will log them back in
  useEffect(() => {
    // check to see if token is in storage
    const token = localStorage.getItem("jwt");
    if (token) {
      // if so, we will decode it and set the user in app state
      setCurrentUser(jwt_decode(token));
    } else {
      setCurrentUser(null);
    }
  }, []); // happen only once

  // event handler to log the user out when needed
  const handleLogout = () => {
    // check to see if a token exists in local storage
    if (localStorage.getItem("jwt")) {
      // if so, delete it
      localStorage.removeItem("jwt");
      // set the user in the App state to be null
      setCurrentUser(null);
    }
  };

  const handleLogin = (username, password, closeLoginModal) => {
    axios
      .post("/auth/login", { username, password })
      .then((response) => {
        localStorage.setItem("jwt", response.data.token);
        setCurrentUser(jwt_decode(response.data.token));
        closeLoginModal();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Router>
        <header>
          <Navbar currentUser={currentUser} handleLogout={handleLogout} />
        </header>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route
              path="/register"
              element={
                <Register
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
            <Route
              path="/login"
              element={<Login onLogin={handleLogin} currentUser={currentUser} />}
            />
            <Route
              path="/profile"
              element={
                <Profile
                  handleLogout={handleLogout}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
