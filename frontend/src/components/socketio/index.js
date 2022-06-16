import React, { useRef, useEffect, useState } from "react";
import "./style.css";
import { io } from "socket.io-client";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../Dashboard";
import { setOnlineFriends } from "../Redux/reducers/friends";
import { setMessage, setMessages, setSenders } from "../Redux/reducers/chat";
import { setLike, setNotification } from "../Redux/reducers/like";

const ENDPOINT = "http://localhost:5000";
const socket = io.connect(ENDPOINT);
const SocketIo = () => {
  // const [user, setUser] = useState([]);

  const dispatch = useDispatch();
  // ==========================
  const { token, message, like } = useSelector((state) => {
    return {
      token: state.auth.token,
      message: state.chat.message,
      like: state.like.like,
    };
  });

  // ==========================

  // const getUserById = () => {
  //   axios
  //     .get(`http://localhost:5000/user/${userId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((result) => {
  //       if (result.data.success) {
  //         setUser(...result.data.result);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error.response.data.message);
  //     });
  // };

  const userId = jwt_decode(token).userId;
  const userImage = jwt_decode(token).image;
  const userName = jwt_decode(token).userName;

  useEffect(() => {
  

    socket.emit("userIn", { userId: userId, socketId: socket.id });
    socket.on("online", (data) => {
      dispatch(setOnlineFriends(data));
    });
    socket.on("receive-message", (data) => {
      dispatch(setMessage(data.data));
      dispatch(setMessages());
      dispatch(setSenders(data.messageUsers));
      dispatch(setMessage(""));
    });

    socket.on("send-notification", (data) => {
      console.log(data);
      dispatch(setNotification(data));
    });
  }, [socket]);

  useEffect(() => {
    if (message.message) {
      socket.emit("send-message", message);
      dispatch(setMessage(""));
    }
  }, [message]);

  useEffect(() => {
    if (like) {
      socket.emit("like-post", {
        username: userName,
        image: userImage,
        user_id: like,
      });
      dispatch(setLike(""));
    }
  }, [like]);

  return <div></div>;
};

export default SocketIo;
