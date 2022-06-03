import React, { useEffect, useState, useRef } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePostById,
  setPosts,
  updatePostById,
} from "../Redux/reducers/posts";
import CreatPost from "../Createpost";
import "./style.css";
import { BsThreeDotsVertical } from "react-icons/bs";

const Dashboard = () => {
  const [content, setContent] = useState("");
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [open, setOpen] = useState(false);

  const [dropdownId, setDropdownId] = useState("");
  const [updatecontent, setUpdatecontent] = useState("");

  const formRef = useRef("");
  //=================================
  const dispatch = useDispatch();

  const { posts } = useSelector((state) => {
    return {
      posts: state.posts.posts,
    };
  });
  const { token } = useSelector((state) => {
    return {
      token: state.auth.token,
    };
  });
  //=================================

  const showDD = (e) => {
    setOpen(!open);
    setDropdownId(e.target.id);
  };
  //=================================

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

  //=================================

  const editpost = (id) => {
    axios
      .put(`http://localhost:5000/posts/${id}`, {
        content: updatecontent,
      })
      .then((result) => {
        if (result.data.success) {
          dispatch(updatePostById({ content: updatecontent, id }));
        }
      })
      .catch((error) => {
        {
          console.log(error);
        }
      });
  };
  //=================================
  const deletepost = (id) => {
    axios
      .delete(`http://localhost:5000/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(deletePostById(id));
      })
      .catch((error) => {
        {
          console.log(error.response.data.message);
        }
      });
  };

  //=================================

  const updateForm = (e, postcontent) => {
    setShowUpdate(!showUpdate);
    setDropdownId(e.target.id);
    setUpdatecontent(postcontent);
    setOpen(!open);
  };

  //=================================
  useEffect(() => {
    getAllPosts();
  }, []);
  return (
    <div className="post-container">
      <CreatPost />
      {show &&
        posts.map((post, index) => {
          return (
            <div key={index} className="post">
              <div className="dd-container">
                <button
                  id={post.id}
                  className="dd-button"
                  onClick={(e) => {
                    showDD(e);
                  }}
                >
                  <BsThreeDotsVertical
                    id={post.id}
                    onClick={(e) => {
                      showDD(e);
                    }}
                  />
                </button>
                {open && dropdownId == post.id ? (
                  <div className="dropdown">
                    <div
                      className="options-div"
                      id={post.id}
                      onClick={(e) => {
                        updateForm(e, post.content);
                      }}
                    >
                      Update
                    </div>

                    <div
                      className="options-div"
                      id={post.id}
                      onClick={(e) => {
                        deletepost(e.target.id);
                      }}
                    >
                      Delete
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <p>{post.content}</p>
              {post.id == dropdownId && showUpdate ? (
                <form
                  className="update-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowUpdate(false);
                    editpost(post.id);
                  }}
                  ref={formRef}
                >
                  <input
                    defaultValue={post.content}
                    onChange={(e) => {
                      setUpdatecontent(e.target.value);
                    }}
                  />
                  <button>Update</button>
                </form>
              ) : (
                ""
              )}
            </div>
          );
        })}
      {!posts.length ? <h1>No posts</h1> : ""}
    </div>
  );
};

export default Dashboard;
