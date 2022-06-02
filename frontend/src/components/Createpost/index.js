import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { addPost } from "../Redux/reducers/Post";

import jwt_decode from "jwt-decode";

const CreatPost = () => {
  const [content, setContent] = useState("");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImZpcnN0TmFtZSI6Im5hZGlhIiwibGFzdE5hbWUiOiJiYXlvdW4iLCJyb2xlIjoxLCJpYXQiOjE2NTQxOTk5Mzd9.-4IXoKKOhPXIGi9te3QB3MXAIxngQ2FInLejn6It_Lw";

  const formRef = useRef("");
  //=================================
  const dispatch = useDispatch();

  const newPost = async (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:5000/posts/",
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          dispatch(addPost({ content }));

          formRef.current.reset();
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  //=================================

  return (
    <div className="tasks-container">
      <h1>
        {" "}
        {jwt_decode(token).firstName} {jwt_decode(token).lastName}
      </h1>
      <form ref={formRef} onSubmit={newPost} className="addPost">
        <br />

        <textarea
          placeholder="article description here"
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <button>photo</button>
        <button>Add</button>
      </form>
    </div>
  );
};

export default CreatPost;
