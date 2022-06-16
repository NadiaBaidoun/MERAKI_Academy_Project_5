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
import { clearNotification } from "../Redux/reducers/like";
import { clearSenders } from "../Redux/reducers/chat";

const Navbar = () => {
  const [showMessages, setShowMessages] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [user, setUser] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, token, notifications, senders } = useSelector((state) => {
    return {
      isLoggedIn: state.auth.isLoggedIn,
      token: state.auth.token,
      notifications: state.like.notification,
      senders: state.chat.senders,
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
              id="Link"
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotification(false);
              }}
            >
              <BsMessenger
                className="nav-mid-icon"
                style={showMessages ? { color: "#2374e1" } : ""}
              />
              <div className={senders.length ? "notification-number" : "hide"}>
                {senders.length}
              </div>
            </div>

            <div
              className="nav-mid-div"
              id="Link"
              onClick={() => {
                setShowNotification(!showNotification);
                setShowMessages(false);
              }}
            >
              <MdNotifications
                style={showNotification ? { color: "#2374e1" } : ""}
                className="nav-mid-icon notification-icon"
              />

              <div
                className={
                  notifications.length ? "notification-number" : "hide"
                }
              >
                {notifications.length}
              </div>
            </div>
            <div className={showNotification ? "popup-navbar" : "hide"}>
              <h1>Notifications :</h1>
              {notifications.length ? (
                <>
                  {notifications.map((el) => {
                    return (
                      <div className="notification">
                        <img className="Icon" src={el.image} />
                        <strong style={{ marginRight: "5px" }}>
                          {el.username}
                        </strong>
                        liked your post
                      </div>
                    );
                  })}
                  <button
                    className="read"
                    id="Link"
                    onClick={() => {
                      dispatch(clearNotification());
                      setShowNotification(false);
                    }}
                  >
                    Mark as read
                  </button>
                </>
              ) : (
                <h1 className="empty">You have no notifications</h1>
              )}
            </div>
            <div className={showMessages ? "popup-navbar" : "hide"}>
              <h1>Messages :</h1>
              {senders.length ? (
                <>
                  {senders.map((el) => {
                    return (
                      <div className="notification">
                        <img className="Icon" src={el.image} />
                        <strong style={{ marginRight: "5px" }}>
                          {el.name}
                        </strong>
                        messaged you
                      </div>
                    );
                  })}
                  <button
                    className="read"
                    id="Link"
                    onClick={() => {
                      dispatch(clearSenders());
                      setShowMessages(false);
                    }}
                  >
                    Mark as read
                  </button>
                </>
              ) : (
                <h1 className="empty">You have no messages</h1>
              )}
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
