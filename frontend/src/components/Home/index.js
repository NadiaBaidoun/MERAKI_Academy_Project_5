import React, { useEffect, useState, useRef } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../Redux/reducers/posts";


const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [open, setOpen] = useState(false);

  const [dropdownId, setDropdownId] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");

  const formRef = useRef("");
  //=================================
  const dispatch = useDispatch();

  const { posts } = useSelector((state) => {
    return {
      posts: state.post.posts,
    };
  });


  //=================================
  const getAllPosts = () => {
    axios
      .get("http://localhost:5000/posts")
      .then((result) => {
        if (result.data.success) {
          dispatch(setPosts(result.data.result));
          setShow(true);
        }
      })
      .catch((error) => {
        setShow(false);
        console.log(error.response.data.message);
      });
  };

  useEffect(() => {
    getAllPosts();
  }, []);
  return (
    <div className="post-container">
      {show &&
        posts.map((post, index) => {
          return (
            <div key={index} className="post">
              <p>{post.content}</p>
            </div>
          );
        })}
      {!posts.length ? <h1>No posts</h1> : ""}
    </div>
  );
};

export default Dashboard;
