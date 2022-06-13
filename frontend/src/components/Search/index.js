import React, { useState, useRef, useEffect } from "react";

import axios from "axios";
import "./style.css";

import { setAllUsers, setUserName } from "../Redux/reducers/users";
import { FiArrowLeft } from "react-icons/fi";
import { FaFacebook } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const Search = () => {
  const [name, setName] = useState("");
  const [searchBox, setSearchBox] = useState(false);
  const [live, setLive] = useState([]);
  const nameRef = useRef("");
  const searchName = useRef("");
  const navigate = useNavigate();

  //=================================

  const { token } = useSelector((state) => {
    return {
      token: state.auth.token,
    };
  });

  const { allUser } = useSelector((state) => {
    return {
      allUser: state.users.allUsers,
    };
  });

  //=================================
  const dispatch = useDispatch();
  const userId = jwt_decode(token).userId;

  //=================================

  const getUserByName = () => {
    axios
      .get(`http://localhost:5000/user/search/${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (result.data.success) {
          dispatch(setUserName(result.data.result));
          setName("");
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  //=================================
  const getAllUsers = () => {
    axios
      .get(`http://localhost:5000/user/search_2/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (result.data.success) {
          setLive(result.data.result);
          dispatch(setAllUsers(result.data.result));
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  //=================================

  useEffect(() => {
    getAllUsers();
    document.addEventListener("mousedown", (e) => {
      if (e.target.id !== "Link") {
        setSearchBox(false);
        nameRef.current.reset();
      }
    });
  }, []);

  return (
    <div className="search-container">
      <div className="search-action">
        {searchBox ? (
          <div
            className="left-arrow"
            onClick={() => {
              nameRef.current.reset();
              setSearchBox(false);
            }}
          >
            <FiArrowLeft className="back-icon" />
          </div>
        ) : (
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Facebook_f_logo_%282021%29.svg/800px-Facebook_f_logo_%282021%29.svg.png"
            className="logo"
            onClick={() => {
              nameRef.current.reset();
              navigate("/home");
            }}
          />
        )}
        <form className="input-container" ref={nameRef}>
          <AiOutlineSearch className={searchBox ? "hide" : "search-icon"} />
          <input
            ref={searchName}
            className="search-box"
            placeholder="     Search Facebook"
            onClick={() => {
              setSearchBox(true);
            }}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </form>
      </div>
      <div className={searchBox ? "search-div" : "hide"}>
        <div className="users">
          {searchName.current.value ? (
            <div className="search-result">
              {allUser
                .filter((el) => {
                  return el.userName.includes(searchName.current.value);
                })
                .map((user, i) => {
                  if (i < 5) {
                    return (
                      <div
                        id="Link"
                        className={`user-search ${user.id}`}
                        key={user.id}
                        onClick={(e) => {
                          const id = parseInt(e.target.className.split(" ")[1]);
                          userId === id
                            ? navigate("/profile")
                            : navigate(`/users/${id}`);
                          nameRef.current.reset();
                          setSearchBox(false);
                        }}
                      >
                        <img src={user.image} className="user-search-icon" />
                        {user.userName}
                      </div>
                    );
                  }
                })}
              {name ? (
                <div
                  id={"Link"}
                  className="user-search"
                  onClick={() => {
                    navigate("/search/users");
                    getUserByName();
                    nameRef.current.reset();
                    setSearchBox(false);
                  }}
                >
                  <AiOutlineSearch className="bottom-icon" /> Search for {name}
                </div>
              ) : (
                <div
                  id={"Link"}
                  onClick={() => {
                    setSearchBox(false);
                    nameRef.current.reset();
                  }}
                  className="user-search"
                >
                  <AiOutlineSearch className="bottom-icon" /> Search for {name}
                </div>
              )}
            </div>
          ) : (
            <div className="search-result">
              {allUser
                .filter((el, i) => {
                  return i < 6;
                })
                .map((user) => {
                  return (
                    <div
                      id="Link"
                      className={`user-search ${user.id}`}
                      key={user.id}
                      onClick={(e) => {
                        const id = parseInt(e.target.className.split(" ")[1]);
                        userId === id
                          ? navigate("/profile")
                          : navigate(`/users/${id}`);
                        nameRef.current.reset();
                        setSearchBox(false);
                      }}
                    >
                      <img src={user.image} className="user-search-icon" />
                      {user.userName}
                    </div>
                  );
                })}
              {name ? (
                <div
                  id={"Link"}
                  className="user-search"
                  onClick={() => {
                    navigate("/search/users");
                    getUserByName();
                    nameRef.current.reset();
                    setSearchBox(false);
                  }}
                >
                  <AiOutlineSearch className="bottom-icon" /> Search for {name}
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Search;
