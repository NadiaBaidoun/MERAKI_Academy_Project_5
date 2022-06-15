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

import { FaRegCommentAlt } from "react-icons/fa";
import { BsQuestionSquare } from "react-icons/bs";
// import { HiOutlineStatusOnline } from "react-icons/hi";
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
import { Link, useNavigate } from "react-router-dom";
import { setAllUsers, setUsers } from "../Redux/reducers/users";
import { setFriends } from "../Redux/reducers/friends";

import { MdOutlinePermMedia } from "react-icons/md";
// import { setUsers } from "../Redux/reducers/users";
import { IoCloseSharp } from "react-icons/io5";

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
  const updatePostRef = useRef("");

  const imageRef = useRef("");
  const [postUrl, setPostUrl] = useState("");
  const imageEditRef = useRef("");
  const [postEditUrl, setPostEditUrl] = useState("");

  //=================================
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts } = useSelector((state) => {
    return {
      posts: state.posts.posts,
    };
  });
  const { allUser } = useSelector((state) => {
    return {
      allUser: state.users.allUsers,
    };
  });

  const { users, friends } = useSelector((state) => {
    return {
      users: state.users.users,
      friends: state.friends.friends,
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

  const userId = jwt_decode(token).userId;
  //=================================

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
  const getUserById = () => {
    axios
      .get(`http://localhost:5000/user/${userId}`, {
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
  //=================================
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

  const editpost = (id, image) => {
    axios
      .put(`http://localhost:5000/posts/${id}`, {
        content: updatecontent,
        image: postEditUrl || image,
      })
      .then((result) => {
        if (result.data.success) {
          dispatch(
            updatePostById({
              content: updatecontent,
              image: postEditUrl || image,
              id,
            })
          );
          setPostEditUrl("");
          setContent("");
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

  const getAllFriends = () => {
    axios
      .get(`http://localhost:5000/user/list/friends/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((result) => {
        const friendsRes = result.data.result;

        if (result.data.success) {
          let arrayofFriends = [];

          if (friendsRes.length > 6) {
            const filteredFriends = friendsRes.filter((el, i) => {
              return i <= 5;
            });
            arrayofFriends = [...filteredFriends];
          } else if (friendsRes.length <= 6) {
            arrayofFriends = [...friendsRes];
          }

          dispatch(setFriends(arrayofFriends));
          setShow(true);
        }
      })
      .catch((error) => {
        dispatch(setFriends([]));
        console.log(error.response.data);
      });
  };

  //=================================
  const getAllUsers = () => {
    axios
      .get(`http://localhost:5000/user/search_2/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (result.data.success) {
          dispatch(setAllUsers(result.data.result));
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  //=================================

  const handelCheckUser = (id) => {
    if (id == userId) {
      navigate("/profile");
    } else {
      navigate(`/users/${id}`);
    }
  };

  const resize = (e) => {
    const textarea = document.getElementById(e.target.id);
    textarea.style.height = "40px";
    let scHeight = e.target.scrollHeight;
    textarea.style.height = `${scHeight - 0}px`;
  };

  useEffect(() => {
    getAllPosts();
    getAllComments();
    getUserById();
    getAllUsers();
    getAllFriends();
  }, []);

  return (
    <div className="container">
      <div className="sidebar">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            {users.map((user, i) => {
              return (
                <div
                  className="profileName"
                  key={i}
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  <img className="Icon" src={user.image} />
                  <p>{user.userName} </p>
                </div>
              );
            })}
          </li>

          <li className="sidebarListItem">
            <MdOutlineRssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <MdOutlineGroups className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <MdVideoSettings className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>

          <li className="sidebarListItem">
            <MdBookmarks className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <BsQuestionSquare className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <MdOutlineFindInPage className="sidebarIcon" />
            <span className="sidebarListItemText">Pages</span>
          </li>
          <li className="sidebarListItem">
            <MdOutlineEventAvailable className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <MdSchool className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
        </ul>
        <hr className="sidebarHr" />
      </div>
      <div className="feed">
        <div className="post-container">
          <div className="share">
            <div className="shareWrapper">
              <form ref={addPostRef} className="addPost" onSubmit={newPost}>
                <div className="shareTop">
                  {show &&
                    users.map((user, index) => {
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

          <div className="container-post">
            {" "}
            {show &&
              posts.map((post, index) => {
                return (
                  <div key={index}>
                    <div className="post">
                      <div className="postWrapper">
                        <div className="postTop">
                          {/* DIV TOP */}
                          {allUser.map((user, i) => {
                            if (post.user_id === user.id) {
                              return (
                                <div key={user.id}>
                                  <div
                                    className="profileName"
                                    onClick={() => {
                                      navigate(`/users/${post.user_id}`);
                                    }}
                                  >
                                    <img className="Icon" src={user.image} />
                                    <p>{user.userName} </p>
                                  </div>
                                </div>
                              );
                            }
                          })}
                          {/* flex+center+spacebetween */}

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
                          {/* ------------------------------------------------------------ */}
                          {/*DIV TOP  */}
                        </div>
                        <div className="postCenter">
                          <p>{post.content}</p>
                          {post.image ? <img src={post.image} /> : ""}
                        </div>
                        <div>
                          {post.id == dropdownId && showUpdate ? (
                            <div className={"update-post-popup"}>
                              <div className="update-post-header">
                                <h1>Update post</h1>
                                <IoCloseSharp
                                  className="close-btn"
                                  onClick={() => setShowUpdate(false)}
                                />
                              </div>
                              <form
                                className="update-form"
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  setShowUpdate(false);

                                  editpost(post.id, post.image);
                                }}
                                ref={formRef}
                              >
                                <label
                                  htmlFor="update-post-image"
                                  className="update-post-image-label"
                                >
                                  <input
                                    id="update-post-image"
                                    hidden
                                    type="file"
                                    onChange={(e) => {
                                      imageEditRef.current = e.target.files[0];
                                      editPostImage();
                                    }}
                                  />
                                  UPDATE IMAGE
                                </label>

                                <input
                                  defaultValue={post.content}
                                  onChange={(e) => {
                                    setUpdatecontent(e.target.value);
                                  }}
                                />
                                <button>Update</button>
                              </form>
                              <img
                                className="iamge-post"
                                src={
                                  postEditUrl ||
                                  "https://image.shutterstock.com/image-vector/camera-add-icon-260nw-1054194038.jpg"
                                }
                              />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>

                        <div className="postLike">
                          <div className="postLike_div">
                            <div className="postLike-header_like">
                              <AiTwotoneLike className="hand" />
                            </div>

                            <p>{post.like.length} people like it</p>
                          </div>
                          <div className="like-div">
                            {post.like ? (
                              <>
                                <button
                                  className="like like-btn"
                                  onClick={(e) => {
                                    post.like.includes(userId)
                                      ? unLikePost(post.id)
                                      : likePost(post.id);
                                  }}
                                >
                                  {post.like.includes(userId) ? (
                                    <div className="iconUnlike">
                                      <AiFillLike className="Unlike" /> Like
                                    </div>
                                  ) : (
                                    <div className="iconUnlike">
                                      <AiFillLike /> Like
                                    </div>
                                  )}
                                </button>

                                <button
                                  id={post.id}
                                  className="like comment-btn"
                                  onClick={(e) => {
                                    const commentSection =
                                      document.getElementById(
                                        `comment-${e.target.id}`
                                      );

                                    commentSection.focus();
                                  }}
                                >
                                  <FaRegCommentAlt />
                                  Comment
                                </button>
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        {/* ------------------------------------------------------------------------------ */}

                        <div className="postComment">
                          <div className="comment-div ">
                            <button
                              className="allComments-btn"
                              id={post.id}
                              onClick={(e) => {
                                const commentDiv = document.getElementById(
                                  `commentDiv${e.target.id}`
                                );
                                commentDiv.style.display = "block";
                              }}
                            >
                              View all comments
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
                                                dropdownIdComment ==
                                                  comment.id ? (
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
                                                        deleteComment(
                                                          e.target.id
                                                        );
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

                                            <div className="comment">
                                              <img
                                                className="Icon"
                                                src={comment.image}
                                              />

                                              <div>
                                                {" "}
                                                <p
                                                  onClick={() =>
                                                    handelCheckUser(
                                                      comment.commenter_id
                                                    )
                                                  }
                                                >
                                                  {comment.userName}
                                                </p>
                                                <p>{comment.comment}</p>
                                              </div>
                                            </div>
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
                              {users.map((user, i) => {
                                return (
                                  <div
                                    className="profileName"
                                    key={i}
                                    onClick={() => {
                                      navigate("/profile");
                                    }}
                                  >
                                    <img className="Icon" src={user.image} />
                                  </div>
                                );
                              })}
                              <form
                                id={`commentform${post.id}`}
                                className="addComment"
                              >
                                <textarea
                                  id={`comment-${post.id}`}
                                  placeholder="Write a comment…"
                                  onChange={(e) => {
                                    setComment(e.target.value);
                                  }}
                                  onKeyUp={(e) => {
                                    resize(e);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      const commentSection =
                                        document.getElementById(
                                          `comment-${e.target.id.split("-")[1]}`
                                        );
                                      const commentDiv =
                                        document.getElementById(
                                          `commentDiv${
                                            e.target.id.split("-")[1]
                                          }`
                                        );
                                      const commentForm =
                                        document.getElementById(
                                          `commentform${
                                            e.target.id.split("-")[1]
                                          }`
                                        );
                                      commentDiv.style.display = "block";
                                      commentSection.focus();
                                      commentForm.reset();
                                      newComment(e, post.id);
                                    }
                                  }}
                                ></textarea>
                              </form>
                            </div>
                            {/* <button
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
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="rightbar">
        <p>Sponsored</p>
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

        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {friends.map((friend, i) => (
            <div key={i.id} className="profileName">
              <div className="online-friend"></div>
              <img className="Icon" src={friend.image} />
              <p>{friend.userName}</p>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Dashboard;
