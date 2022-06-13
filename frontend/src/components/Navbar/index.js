import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

import { useDispatch, useSelector } from "react-redux";

import { logout } from "../Redux/reducers/auth";
import Search from "../Search";
import { FaFacebook } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsMessenger } from "react-icons/bs";
import { MdNotifications } from "react-icons/md";
import { ImExit } from "react-icons/im";
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
    navigate("/");
  };

  return (
    <div className="navbar-container">
      {isLoggedIn ? (
        <div className="navbar">
          <div className="left-navbar">
            <div className="search-container">
              <Search />
            </div>
          </div>
          <div className="navbar-icons">
            <div
              className="nav-mid-div"
              onClick={() => {
                navigate("/home");
              }}
            >
              <AiFillHome className="nav-mid-icon" />
            </div>

            <div className="nav-mid-div">
              <BsMessenger className="nav-mid-icon" />
              <div className="notification-number">2</div>
              <div className="popup-navbar">No notification</div>
            </div>

            <div className="nav-mid-div">
              <MdNotifications className="nav-mid-icon notification-icon" />
              <div className="notification-number">2</div>
              <div>No messages</div>
            </div>
          </div>

          <div className="Links-container">
            <Link className="link" to={"/profile"}>
              Profile
            </Link>

            <div className="logout" onClick={signOut}>
              <ImExit className="logout-icons" /> Logout
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Navbar;
