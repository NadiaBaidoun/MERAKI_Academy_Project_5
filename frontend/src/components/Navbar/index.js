import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

import { useDispatch } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();

  let signOut;

  const isLoggedIn = false;

  return (
    <div className="navbar-container">
      <Link className="header link" to="/home">
        Home
      </Link>
      {!isLoggedIn ? (
        <div className="Links-container">
          <Link className="link" to={"/login"}>
            Login
          </Link>
          <Link className="link" to={"/register"}>
            Register
          </Link>
        </div>
      ) : (
        <div className="Links-container">
          <Link className="link" to={"/home"}>
            Home
          </Link>
          <Link className="link" to={"/profile"}>
            Profile
          </Link>
          <Link className="link" to={"/"} onClick={signOut}>
            Logout
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
