import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";

import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../Redux/reducers/friends";
import { setUsers } from "../Redux/reducers/users";
import { Link } from "react-router-dom";

const SearchResult = () => {
  const [show, setShow] = useState(false);
  const [userFriends, setUserFriends] = useState([]);

  // ==========================

  const dispatch = useDispatch();

  const { users } = useSelector((state) => {
    return {
      users: state.users.users,
    };
  });

  const { token } = useSelector((state) => {
    return {
      token: state.auth.token,
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
    <div className="user-container">
      {users.map((user, index) => {
        return (
          <div key={index}>
            <div className="user">
              {userId === user.id ? (
                <Link
                  style={{ color: "black" }}
                  className="link info"
                  to={`/profile`}
                >
                  <img className="search-photo" src={user.image} />
                  <div className="userInfo">
                    <span>{user.userName}</span>
                    <span>{user.country}</span>
                  </div>
                </Link>
              ) : (
                <Link
                  style={{ color: "black" }}
                  className="link info"
                  to={`/users/${user.id}`}
                >
                  
                  <img className="search-photo" src={user.image} />
                  <div className="userInfo">
                    <p>{user.userName}</p>
                    <p>Lives In <strong>{user.country}</strong> </p>
                  </div>
                </Link>
              )}

              {user.id === userId ? (
                ""
              ) : (
                <>
                  <button
                    className="like"
                    onClick={() => {
                      userFriends.includes(user.id)
                        ? unFollowFriend(user.id)
                        : followFriend(user.id);
                    }}
                  >
                    {userFriends.includes(user.id) ? "Unfollow" : "Follow"}
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
      {!users.length ? <h1>No users</h1> : ""}
    </div>
  );
};
export default SearchResult;
