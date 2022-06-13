import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

import { useDispatch, useSelector } from "react-redux";

import { logout } from "../Redux/reducers/auth";
import Search from "../Search";

import { AiFillHome } from "react-icons/ai";
import { BsMessenger } from "react-icons/bs";
import { MdNotifications } from "react-icons/md";
import { ImExit } from "react-icons/im";
import axios from "axios";

import jwt_decode from "jwt-decode";

const Navbar = () => {
  const [showMessages, setShowMessages] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [user, setUser] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, token } = useSelector((state) => {
    return {
      isLoggedIn: state.auth.isLoggedIn,
      token: state.auth.token,
    };
  });

  const userId = token ? jwt_decode(token).userId : null;

  //=================================
  const getUserById = () => {
    axios
      .get(`http://localhost:5000/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (result.data.success) {
          setUser(result.data.result);
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const signOut = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    if (token) {
      getUserById();
    }

    document.addEventListener("mousedown", (e) => {
      if (e.target.id !== "Link") {
        setShowNotification(false);
        setShowMessages(false);
      }
    });
  }, [token]);

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

            <div
              className="nav-mid-div"
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotification(false);
              }}
            >
              <BsMessenger
                className="nav-mid-icon"
                style={showMessages ? { color: "#2374e1" } : ""}
              />
              <div className="notification-number">2</div>
            </div>

            <div
              className="nav-mid-div"
              onClick={() => {
                setShowNotification(!showNotification);
                setShowMessages(false);
              }}
            >
              <MdNotifications
                style={showNotification ? { color: "#2374e1" } : ""}
                className="nav-mid-icon notification-icon"
              />
              <div className="notification-number">2</div>
            </div>
            <div className={showNotification ? "popup-navbar" : "hide"}>
              No notification
            </div>
            <div className={showMessages ? "popup-navbar" : "hide"}>
              No messages
            </div>
          </div>

          <div className="Links-container">
            {user.map((el) => {
              return (
                <div
                  className="user-container-navbar"
                  key={el.id}
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  <img className="navbar-user" src={el.image} />
                  <p>{el.firstName}</p>
                </div>
              );
            })}

            <div className="logout" onClick={() => signOut()}>
              <ImExit className="logout-icons" />
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
