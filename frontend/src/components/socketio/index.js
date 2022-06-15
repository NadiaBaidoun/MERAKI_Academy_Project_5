import React, { useRef, useEffect } from "react";
import "./style.css";
import { io } from "socket.io-client";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../Dashboard";
import { setOnlineFriends } from "../Redux/reducers/friends";

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
  }, [socket]);

  useEffect(() => {
    socket.emit("send-message", message);
  }, [message]);

  return <div></div>;
};

export default SocketIo;
