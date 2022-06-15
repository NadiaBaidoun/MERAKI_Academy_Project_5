import React, { useRef, useEffect } from "react";
import "./style.css";
import { io } from "socket.io-client";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../Dashboard";
import { setOnlineFriends } from "../Redux/reducers/friends";
import { setMessage, setMessages } from "../Redux/reducers/chat";

const ENDPOINT = "http://localhost:5000";
const socket = io.connect(ENDPOINT);
const SocketIo = () => {
  const onlineFriendsRef = useRef();

  const dispatch = useDispatch();
  // ==========================
  const { token, message } = useSelector((state) => {
    return {
      token: state.auth.token,
      message: state.chat.message,
    };
  });

  const userId = jwt_decode(token).userId;

  useEffect(() => {
    socket.emit("userIn", { userId: userId, socketId: socket.id });
    socket.on("online", (data) => {
      dispatch(setOnlineFriends(data));
    });
    socket.on("receive-message", (data) => {
      console.log(data);
      dispatch(setMessage(data));
      dispatch(setMessages());
      dispatch(setMessage(""));
    });
  }, [socket]);

  useEffect(() => {
    if (message.message) {
      socket.emit("send-message", message);
      dispatch(setMessage(""));
    }
  }, [message]);

  return <div></div>;
};

export default SocketIo;
