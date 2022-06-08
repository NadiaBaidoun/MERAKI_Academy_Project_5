import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";

import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../Redux/reducers/friends";
import { setUsers } from "../Redux/reducers/users";

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
  const getUserById = () => {
    axios
      .get(`http://localhost:5000/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((user) => {
        console.log(user);
        axios
          .get(`http://localhost:5000/user/list/friends/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((result) => {
            const userRes = user.data.result;
            const friendsRes = result.data.result;

            const userFriends = [];

            // userRes.forEach((res) => {
            //   userFriends.push({ ...res, friends: [] });
            // });

            friendsRes.forEach((friend) => {
              userFriends.push(friend.target_id);
            });

            setUserFriends(userFriends);
            // dispatch(setUsers(userFriends));
            // setShow(true);

            // if (result.data.success) {
            //   dispatch(setFriends(result.data.result));
            //   console.log("friends", friends);
            //   setShow(true);
            // }
          })
          .catch((error) => {
            // setShow(false);
            console.log(error.response.data);
            // console.log(error.response.data.message);
          });

        // console.log(result.data.result);
        // if (result.data.success) {
        //   dispatch(setUsers(result.data.result));
        //   setShow(true);
        // }
      })
      .catch((error) => {
        // setShow(false);
        console.log(error.response.data.message);
      });
  };

  useEffect(() => {
    getUserById();
  }, []);

  return (
    <div className="user-container">
      {users.map((user, index) => {
        return (
          <div key={index}>
            <div className="user">
              <h2>{user.userName}</h2>
              <button>
                {userFriends.includes(user.id) ? "Unfollow" : "follow"}
              </button>
              {/* <img className="prof_img" src={user.image} /> */}
            </div>
          </div>
        );
      })}
      {!users.length ? <h1>No users</h1> : ""}
    </div>
  );
};
export default SearchResult;
