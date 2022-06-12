
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
import { BsQuestionSquare } from "react-icons/bs";
// import { HiOutlineStatusOnline } from "react-icons/hi";
import "./style.css";
// import { BsThreeDotsVertical } from "react-icons/bs";
import { addLike, removeLike, setLikes } from "../Redux/reducers/like";
import {
  addComment,
  setComments,
  updateCommentById,
  deleteCommentById,
} from "../Redux/reducers/comments";
import jwt_decode from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { setUsers } from "../Redux/reducers/users";
import { setFriends } from "../Redux/reducers/friends";

import { MdOutlinePermMedia } from "react-icons/md";
// import { setUsers } from "../Redux/reducers/users";

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

  useEffect(() => {
    getAllPosts();
    getAllComments();
    getUserById();
    getAllFriends();
  }, []);

  return (
    <div className="container">
      <div className="sidebar">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            {users.map((user, i) => {
              console.log(users);
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
          </div>

          {show &&
            posts.map((post, index) => {
              return (
                <div key={index}>
                  <div className="post">
                    <div className="postWrapper">
                      <div className="postTop">
                        <div className="postTopLeft">
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
                        <div className="postTopRight"></div>
                      </div>

                      <div className="postBottom"></div>
                      <div className="postBottomLeft"></div>
                    </div>
                  </div>
                </div>
              );
            })}
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