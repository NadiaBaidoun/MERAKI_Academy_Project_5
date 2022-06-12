import React, { useEffect, useState, useRef } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePostById,
  setPosts,
  updatePostById,
} from "../Redux/reducers/posts";

import "./style.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { addLike, removeLike, setLikes } from "../Redux/reducers/like";
import {
  addComment,
  setComments,
  updateCommentById,
  deleteCommentById,
} from "../Redux/reducers/comments";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";

import { MdOutlinePermMedia } from "react-icons/md";
import { setUsers } from "../Redux/reducers/users";

// import { PermMedia, Label, Room, EmojiEmotions } from "@material-ui/icons";

const Dashboard = () => {
  const [content, setContent] = useState("");
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownId, setDropdownId] = useState("");
  const [openComment, setOpenComment] = useState(false);
  const [showCommentUpdate, setShowCommentUpdate] = useState(false);
  const [dropdownIdComment, setDropdownIdComment] = useState("");
  const [comment, setComment] = useState("");
  const [updatecontent, setUpdatecontent] = useState("");
  const [updatecomment, setupdatecomment] = useState("");
  const [friendsNum, setFriendsNum] = useState(false);

  const formRef = useRef("");
  const addPostRef = useRef("");
  const addCommentRef = useRef("");

  const imageRef = useRef("");
  const [postUrl, setPostUrl] = useState("");
  const imageEditRef = useRef("");
  const [postEditUrl, setPostEditUrl] = useState("");

  //=================================
  const dispatch = useDispatch();

  const { posts } = useSelector((state) => {
    return {
      posts: state.posts.posts,
    };
  });

  const { likes } = useSelector((state) => {
    return {
      likes: state.like.likes,
    };
  });

  const { token } = useSelector((state) => {
    return {
      token: state.auth.token,
    };
  });

  const { comments } = useSelector((state) => {
    return {
      comments: state.comments.comments,
    };
  });

  const { users } = useSelector((state) => {
    return {
      users: state.users.users,
    };
  });

  const userId = jwt_decode(token).userId;
  //=================================

  const getUserById = (id) => {
    axios
      .get(`http://localhost:5000/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (result.data.success) {
          // setUsers(result.data.result);
          dispatch(setUsers(result.data.result));
          setShow(true);
        }
      })
      .catch((error) => {
        setShow(false);
        console.log(error.response.data.message);
      });
  };

  const newPost = (e) => {
    e.preventDefault();
    if (content || postUrl) {
      axios
        .post(
          "http://localhost:5000/posts/",
          { content, image: postUrl },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            setContent("");
            setPostUrl("");
            getAllPosts();
            addPostRef.current.reset();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //=================================

  const uploadImage = () => {
    const data = new FormData();

    data.append("file", imageRef.current);
    data.append("upload_preset", "olfkj7in");
    data.append("cloud_name", "aa");
    fetch("https://api.cloudinary.com/v1_1/dviqtfdwx/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setPostUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  //=================================

  const showDD = (e) => {
    setOpen(!open);
    setDropdownId(e.target.id);
  };
  //=================================

  const showDDComment = (e) => {
    setOpenComment(!openComment);
    setDropdownIdComment(e.target.id);
  };

  //=================================
  const getAllPosts = () => {
    axios
      .get("http://localhost:5000/posts")
      .then((res) => {
        axios
          .get(`http://localhost:5000/user/list/friends/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((result) => {
            axios
              .get(`http://localhost:5000/likes`)
              .then((response) => {
                const postsRes = res.data.result.reverse();
                const likeRes = response.data.result;
                const friendRes = result.data.result;

                const postWithLike = [];

                postsRes.forEach((post) => {
                  if (post.user_id === userId) {
                    postWithLike.push({ ...post, like: [] });
                  }
                  friendRes.forEach((friend) => {
                    if (post.user_id === friend.target_id) {
                      postWithLike.push({ ...post, like: [] });
                    }
                  });
                });

                postWithLike.forEach((post) => {
                  likeRes.forEach((like) => {
                    if (post.id == like.post_id) {
                      post.like.push(like.user_id);
                    }
                  });
                });
                dispatch(setPosts(postWithLike));
                setShow(true);
                setFriendsNum(false);
              })
              .catch((error) => {
                if (error.response.data.massage.includes("likes")) {
                  const postsRes = res.data.result.reverse();
                  const friendRes = result.data.result;

                  const postWithLike = [];

                  postsRes.forEach((post) => {
                    if (post.user_id === userId) {
                      postWithLike.push({ ...post, like: [] });
                    }

                    friendRes.forEach((friend) => {
                      if (post.user_id === friend.target_id) {
                        postWithLike.push({ ...post, like: [] });
                      }
                    });
                  });
                  dispatch(setPosts(postWithLike));
                  setShow(true);
                  setFriendsNum(false);
                }
              });
          })
          .catch((error) => {
            console.log(error.response.data);
            const postsRes = res.data.result.reverse();
            const filtered = postsRes.filter((el) => {
              return el.user_id === userId;
            });
            if (filtered.length) {
              const postWithLike = [];
              postsRes.forEach((post) => {
                if (post.user_id === userId) {
                  postWithLike.push({ ...post, like: [] });
                }
              });
              dispatch(setPosts(postWithLike));
              setShow(true);
            } else {
              setFriendsNum(true);
            }
          });
      })
      .catch((error) => {
        setShow(false);
        console.log(error.response.data.massage);
      });
  };

  //=================================

  const editpost = (id) => {
    axios
      .put(`http://localhost:5000/posts/${id}`, {
        content: updatecontent,
        image: postEditUrl,
      })
      .then((result) => {
        if (result.data.success) {
          dispatch(
            updatePostById({ content: updatecontent, image: postEditUrl, id })
          );
        }
      })
      .catch((error) => {
        {
          console.log(error);
        }
      });
  };
  //=================================

  const editPostImage = () => {
    const data = new FormData();

    data.append("file", imageEditRef.current);
    data.append("upload_preset", "olfkj7in");
    data.append("cloud_name", "aa");
    fetch("https://api.cloudinary.com/v1_1/dviqtfdwx/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setPostEditUrl(data.url);
      })
      .catch((err) => console.log(err));
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

  const updateFormComment = (e, commentcomment) => {
    setShowCommentUpdate(!showCommentUpdate);
    setDropdownIdComment(e.target.id);
    setupdatecomment(commentcomment);
    setOpenComment(!openComment);
  };

  //=================================

  const likePost = (id) => {
    axios
      .post(
        `http://localhost:5000/likes/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        dispatch(addLike({ post_id: id }));
        getAllPosts();
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  //=================================
  const unLikePost = (id) => {
    axios
      .delete(`http://localhost:5000/likes/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(removeLike({ post_id: id }));
        getAllPosts();
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  //=================================

  const getAllComments = async () => {
    axios
      .get(`http://localhost:5000/comments`)
      .then((result) => {
        dispatch(setComments(result.data.result));
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  //=================================

  const newComment = (e, id) => {
    e.preventDefault();
    if (comment) {
      axios
        .post(
          `http://localhost:5000/comments/${id}`,
          { comment },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            dispatch(addComment({ comment, post_id: id }));
            setComment("");
            getAllComments();
            addCommentRef.current.reset();
          }
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    }
  };

  //=================================

  const editComment = (id) => {
    axios
      .put(`http://localhost:5000/comments/update/${id}`, {
        comment: updatecomment,
      })
      .then((result) => {
        if (result.data.success) {
          dispatch(updateCommentById({ comment: updatecomment, id }));
        }
      })
      .catch((error) => {
        {
          console.log(error);
        }
      });
  };

  //=================================

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:5000/comments/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(deleteCommentById(id));
      })
      .catch((error) => {
        {
          console.log(error.response.data.message);
        }
      });
  };

  useEffect(() => {
    getAllPosts();
    getAllComments();
    getUserById(userId);
  }, []);

  return (
    <div className="post-container">
      <div className="post-container">
        <div className="share">
          <div className="shareWrapper">
            <form ref={addPostRef} className="addPost" onSubmit={newPost}>
              <div className="shareTop">
                {show &&
                  users.map((user,index) => {
                    console.log("User", user);
                    return (
                      <img
                      key={index}
                        className="shareProfileImg"
                        src={user.image}
                        alt=""
                      />
                    );
                  })}
                <input
                  placeholder={`What's on your mind ${
                    jwt_decode(token).firstName
                  }`}
                  className="shareInput"
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <hr className="shareHr"></hr>
              <div className="shareBottom">
                <div className="shareOptions">
                  <div className="shareOption">
                    <label htmlFor="post-img" className="label-post-img">
                      <input
                        hidden
                        id="post-img"
                        type="file"
                        onChange={(e) => {
                          imageRef.current = e.target.files[0];
                          uploadImage();
                        }}
                      />
                      <MdOutlinePermMedia className="shareIcon" />
                      <span className="shareOptionText">Photo</span>
                    </label>
                  </div>
                  <button className="shareButton">Add</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {show &&
        posts.map((post, index) => {
          return (
            <div key={index}>
              <div className="post">
                <div className="postWrapper">
                  <div className="postTop">
                    <div className="postTopLeft">
                      <img
                        className="postProfileImg"
                        src={`${post.image}`}
                        alt=""
                      />
                      <span className="postUsername">
                        {post.user_id === userId ? (
                  <Link
                    style={{ color: "black" }}
                    className="link"
                    to={`/profile`}
                  >
                    <h3>{post.userName}</h3>
                  </Link>
                ) : (
                  <Link
                    style={{ color: "black" }}
                    className="link"
                    to={`/users/${post.user_id}`}
                  >
                    <h3>{post.userName}</h3>
                  </Link>
                )}
                </span>                      
              </div>
                    <div className="postTopRight">
                    {post.user_id == userId ? (
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
                ) : (
                  ""
                )}
                    </div>
                  </div>
                  <div className="postCenter">
                    <span className="postText">{post.content}</span>
                    <img
                        className="postImg"
                        src={`${post.image}`}
                        alt=""
                      />
                    </div>
                  <div className="postBottom"></div>
                  <div className="postBottomLeft">

                  </div>
                  <div className="postBottomRight"></div>
                </div>
              </div>{post.id == dropdownId && showUpdate ? (
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
                      type="file"
                      onChange={(e) => {
                        imageEditRef.current = e.target.files[0];
                        editPostImage();
                      }}
                    />
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
              <div className="like-div">
                <button
                  className="like"
                  onClick={(e) => {
                    post.like.includes(userId)
                      ? unLikePost(post.id)
                      : likePost(post.id);
                  }}
                >
                  {post.like.includes(userId) ? "Unlike" : "Like"}
                </button>
                <p>{post.like.length}</p>
                <button
                  id={post.id}
                  className="like"
                  onClick={(e) => {
                    const commentSection = document.getElementById(
                      `comment${e.target.id}`
                    );
                    const commentDiv = document.getElementById(
                      `commentDiv${e.target.id}`
                    );
                    commentDiv.style.display = "block";
                    commentSection.focus();
                  }}
                >
                  Comment
                </button>
              </div>
              <div className="comment-div">
                <button
                  id={post.id}
                  onClick={(e) => {
                    const commentDiv = document.getElementById(
                      `commentDiv${e.target.id}`
                    );
                    commentDiv.style.display = "block";
                  }}
                >
                  Show all comments
                </button>
                <div
                  id={`commentDiv${post.id}`}
                  className="allComments"
                  style={{ display: "none" }}
                >
                  {show &&
                    comments.map((comment, index) => {
                      return (
                        <div key={index}>
                          <div>
                            {post.id === comment.post_id ? (
                              <div className="comment-div-container">
                                {comment.commenter_id == userId ? (
                                  <div className="dd-comment">
                                    <button
                                      id={comment.id}
                                      className="dd-button"
                                      onClick={(e) => {
                                        showDDComment(e);
                                      }}
                                    >
                                      <BsThreeDotsVertical
                                        id={comment.id}
                                        onClick={(e) => {
                                          showDDComment(e);
                                        }}
                                      />
                                    </button>
                                    {openComment &&
                                    dropdownIdComment == comment.id ? (
                                      <div className="dropdown-comment">
                                        <div
                                          className="options-div"
                                          id={comment.id}
                                          onClick={(e) => {
                                            updateFormComment(
                                              e,
                                              comment.comment
                                            );
                                          }}
                                        >
                                          Update
                                        </div>

                                        <div
                                          className="options-div"
                                          id={comment.id}
                                          onClick={(e) => {
                                            deleteComment(e.target.id);
                                          }}
                                        >
                                          Delete
                                        </div>
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                ) : (
                                  ""
                                )}

                                {comment.commenter_id === userId ? (
                                  <Link
                                    style={{ color: "black" }}
                                    className="link"
                                    to={`/profile`}
                                  >
                                    {comment.userName}
                                  </Link>
                                ) : (
                                  <Link
                                    style={{ color: "black" }}
                                    className="link"
                                    to={`/users/${comment.commenter_id}`}
                                  >
                                    {comment.userName}
                                  </Link>
                                )}
                                <p className="comment">{comment.comment}</p>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          {comment.id == dropdownIdComment &&
                          showCommentUpdate ? (
                            <form
                              className="update-form"
                              onSubmit={(e) => {
                                e.preventDefault();
                                setShowCommentUpdate(false);
                                editComment(comment.id);
                              }}
                              ref={formRef}
                            >
                              <input
                                defaultValue={comment.comment}
                                onChange={(e) => {
                                  setupdatecomment(e.target.value);
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
                  {!comments.length ? <h1>No comments</h1> : ""}
                </div>
                <div className="comment-container">
                  <h1>
                    {jwt_decode(token).firstName} {jwt_decode(token).lastName}
                  </h1>
                  <form ref={addCommentRef} className="addComment">
                    <textarea
                      id={`comment${post.id}`}
                      placeholder="comment here"
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                    ></textarea>
                    <button
                      id={post.id}
                      className="like"
                      onClick={(e) => {
                        const commentSection = document.getElementById(
                          `comment${e.target.id}`
                        );
                        const commentDiv = document.getElementById(
                          `commentDiv${e.target.id}`
                        );
                        commentDiv.style.display = "block";
                        commentSection.focus();
                        newComment(e, post.id);
                      }}
                    >
                      Add
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      {!posts.length || friendsNum ? <h1>No posts</h1> : ""}
    </div>
  );
};
export default Dashboard;
