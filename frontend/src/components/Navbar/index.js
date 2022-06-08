import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";

import { useDispatch, useSelector } from "react-redux";

import { logout } from "../Redux/reducers/auth";
import Search from "../Search";

const Navbar = () => {
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => {
    return {
      isLoggedIn: state.auth.isLoggedIn,
    };
  });

  const signOut = () => {
    dispatch(logout());
  };

  return (
    <div className="navbar-container">
      {isLoggedIn ? (
        <div className="navbar">
          <div>
            <Search />
          </div>
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
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Navbar;
