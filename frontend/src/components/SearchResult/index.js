import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePostById,
  setPosts,
  updatePostById,
} from "../Redux/reducers/posts";
import {
  MdOutlineRssFeed,
  MdOutlineGroups,
  MdVideoSettings,
  MdBookmarks,
  MdOutlineEventAvailable,
  MdOutlineFindInPage,
  MdSchool,
} from "react-icons/md";
import { AiFillLike, AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import {
  FcBookmark,
  FcCalendar,
  FcGraduationCap,
  FcQuestions,
  FcUpload,
  FcVideoFile,
} from "react-icons/fc";
import { FaRegCommentAlt } from "react-icons/fa";
import { BsQuestionSquare } from "react-icons/bs";
// import { HiOutlineStatusOnline } from "react-icons/hi";
import "./style.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { addLike, removeLike, setLike, setLikes } from "../Redux/reducers/like";
import {
  addComment,
  setComments,
  updateCommentById,
  deleteCommentById,
} from "../Redux/reducers/comments";
import jwt_decode from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { setAllUsers, setUsers } from "../Redux/reducers/users";
import { setFriends } from "../Redux/reducers/friends";

import { MdOutlinePermMedia } from "react-icons/md";

import { IoCloseSharp } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { setMessage, setMessages } from "../Redux/reducers/chat";

const SearchResult = () => {
  const [show, setShow] = useState(false);
  const [userFriends, setUserFriends] = useState([]);

  // ==========================

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => {
    return {
      token: state.auth.token,
    };
  });

  const { users, friends, onlineFriends } = useSelector((state) => {
    return {
      users: state.users.users,
      friends: state.friends.friends,
      onlineFriends: state.friends.onlineFriends,
    };
  });

  const userId = jwt_decode(token).userId;
  // ==========================
  const getAllFriends = () => {
    axios
      .get(`http://localhost:5000/user/list/friends/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        const friendsRes = result.data.result;

        const userFriends = [];

        friendsRes.forEach((friend) => {
          userFriends.push(friend.target_id);
        });

        setUserFriends(userFriends);
      })
      .catch((error) => {
        setUserFriends([]);
        console.log(error.response.data);
      });
  };
  // ==========================
  const followFriend = (id) => {
    axios
      .put(
        `http://localhost:5000/user/follow/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        getAllFriends();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // ==========================
  const unFollowFriend = (id) => {
    axios
      .delete(`http://localhost:5000/user/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        getAllFriends();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllFriends();
  }, []);

  return (
    <div className="container">
      <div className="sidebar">
        <ul className="sidebarList">
          <li
            className="sidebarListItem"
            onClick={() => {
              navigate("/profile");
            }}
          >
            <div className="profileName left-bar-name"></div>
            <img className="Icon" src={jwt_decode(token).image} />
            <p style={{ "font-size": "1.2rem" }}>
              <strong>{jwt_decode(token).userName}</strong>
            </p>
          </li>
          <li className="sidebarListItem">
            <MdOutlineRssFeed className="sidebarIcon color" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <MdOutlineGroups className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <FcVideoFile className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>

          <li className="sidebarListItem">
            <FcBookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <FcQuestions className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <MdOutlineFindInPage className="sidebarIcon" />
            <span className="sidebarListItemText">Pages</span>
          </li>
          <li className="sidebarListItem">
            <FcCalendar className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <FcGraduationCap className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
        </ul>
        <hr className="sidebarHr" />
      </div>
      <div className="feed">
        <div className="post-container">
          {users.map((user, index) => {
            return (
              <div key={index}>
                <div className="friend-div search-friend-div">
                  {userId === user.id ? (
                    <Link
                      style={{ color: "black" }}
                      className="friend-link link"
                      to={`/profile`}
                    >
                      <img className="friendimg" src={user.image} />
                      <div className="userInfo">
                        <p className="searchName">{user.userName}</p>
                        {user.country ? (
                          <p className="searchCountry">
                            Lives In <strong>{user.country}</strong>{" "}
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <Link
                      style={{ color: "black" }}
                      className="friend-link search-link link"
                      to={`/users/${user.id}`}
                    >
                      <img className="friendimg" src={user.image} />
                      <div className="userInfo">
                        <p className="searchName">{user.userName}</p>
                        {user.country ? (
                          <p className="searchCountry">
                            Lives In <strong>{user.country}</strong>{" "}
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </Link>
                  )}

                  {user.id === userId ? (
                    ""
                  ) : (
                    <button
                      className={
                        userFriends.includes(user.id)
                          ? "follow-profile-popup"
                          : "blue-popup"
                      }
                      onClick={() => {
                        userFriends.includes(user.id)
                          ? unFollowFriend(user.id)
                          : followFriend(user.id);
                      }}
                    >
                      {userFriends.includes(user.id) ? "Unfollow" : "Follow"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {!users.length ? <h1>No users</h1> : ""}
        </div>
      </div>
      <div className="rightbar">
        <p className="rightbarTitle">Sponsored</p>
        <div>
          <ul className="sponsored">
            <li className="sponsoredListItem">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVdRmUUezR3wc6OPN0yfY3caMmzdcwbn6oKQ&usqp=CAU" />
              <p> The Most Popular Home Desgin website ... </p>
            </li>
            <li className="sponsoredListItem">
              <img src="https://bridgeenglish.com/images/home/masonry/foto1.jpg" />
              <p>
                Test your English language proficiency required for higher
                education ...
              </p>
            </li>
          </ul>
        </div>

        <hr className="sidebarHr" />

        <h4 className="rightbarTitle">Contacts</h4>
        <div className="rightbarFriendList">
          {friends.map((friend, i) => (
            <div id={friend.target_id} key={i} className="online-users">
              <div
                className={
                  onlineFriends.includes(friend.target_id)
                    ? "online-friend"
                    : "offline-friend"
                }
              ></div>
              <img className="Icon" src={friend.image} />
              <p>{friend.userName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SearchResult;
