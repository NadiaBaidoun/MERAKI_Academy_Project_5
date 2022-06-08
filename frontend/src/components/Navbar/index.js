import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

import { useDispatch, useSelector } from "react-redux";

import { logout } from "../Redux/reducers/auth";
import Search from "../Search";
import { FaFacebook } from "react-icons/fa";
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          <div className="left-navbar">
            <div
              className="facebook-logo"
              onClick={() => {
                navigate("/home");
              }}
            >
              <FaFacebook className="logo" />
            </div>
            <div className="search-container">
              <Search />
            </div>
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
