import React, { useEffect, useState, useRef } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addPost,
  deletePostById,
  setPosts,
  updatePostById,
} from "../Redux/reducers/posts";

import { FaRegCommentAlt } from "react-icons/fa";

import "./style.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { addLike, removeLike, setLikes } from "../Redux/reducers/like";
import jwt_decode from "jwt-decode";
import { setAllUsers, setUsers, updateUserById } from "../Redux/reducers/users";
import { deleteFriendById, setFriends } from "../Redux/reducers/friends";
import { ImCamera } from "react-icons/im";
import { MdOutlinePermMedia } from "react-icons/md";
import { IoHomeSharp } from "react-icons/io5";
import { FaBirthdayCake } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

import { AiFillLike, AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import {
  FcBookmark,
  FcCalendar,
  FcGraduationCap,
  FcQuestions,
  FcUpload,
  FcVideoFile,
} from "react-icons/fc";

import { Link, useNavigate } from "react-router-dom";
import {
  addComment,
  setComments,
  updateCommentById,
  deleteCommentById,
} from "../Redux/reducers/comments";

const Profile = () => {
  const [content, setContent] = useState("");
  const [show, setShow] = useState(false);
  const [PopupFriend, setPopupFriend] = useState(false);
  const [PopupIntro, setPopupIntro] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const addPostRef = useRef("");

  const [dropdownId, setDropdownId] = useState("");

  const [updatecountry, setUpdatecountry] = useState("");
  const [userFriends, setUserFriends] = useState([]);

  // );
  const [updatebirthdate, setUpdatebirthdate] = useState("");
  const [updatebio, setUpdateBio] = useState("");

  const formRef = useRef("");
  const addCommentRef = useRef("");
  const imageRef = useRef("");
  const coverRef = useRef("");
  const profileRef = useRef("");

  const imageEditRef = useRef("");
  const [postEditUrl, setPostEditUrl] = useState("");

  const [postUrl, setPostUrl] = useState("");
  const [showPostPopup, setShowPostPopup] = useState(false);

  const [urlCover, seturlCover] = useState("");
  const [urlImage, seturlImage] = useState("");
  //======================================
  const navigate = useNavigate();
  //=================================Comment================================
  const [openComment, setOpenComment] = useState(false);
  const [showCommentUpdate, setShowCommentUpdate] = useState(false);
  const [dropdownIdComment, setDropdownIdComment] = useState("");
  const [comment, setComment] = useState("");
  const [updatecontent, setUpdatecontent] = useState("");
  const [updatecomment, setupdatecomment] = useState("");
  //========================================================================
  const dispatch = useDispatch();

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
  const { comments } = useSelector((state) => {
    return {
      comments: state.comments.comments,
    };
  });

  const { allUser } = useSelector((state) => {
    return {
      allUser: state.users.allUsers,
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
            document.querySelector("body").style.overflowY = "scroll";

            setShowPostPopup(false);
            getPostByUserId(userId);
            addPostRef.current.reset();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  //=================================

  const showDD = (e) => {
    setOpen(!open);
    setDropdownId(e.target.id);
  };
  //=================================
  //=================================

  const showDDComment = (e) => {
    setOpenComment(!openComment);
    setDropdownIdComment(e.target.id);
  };

  //=================================
  //=================================

  const updateFormComment = (e, commentcomment) => {
    setShowCommentUpdate(!showCommentUpdate);
    setDropdownIdComment(e.target.id);
    setupdatecomment(commentcomment);
    setOpenComment(!openComment);
  };

  //=================================

  const getAllComments = () => {
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

  const newComment = async (e, id) => {
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
          console.log(error);
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

  //=================================

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
          setUserFriends(friendsRes);
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

  const getPostByUserId = (id) => {
    axios
      .get(`http://localhost:5000/posts/user/${id}`)
      .then((res) => {
        axios
          .get(`http://localhost:5000/likes`)
          .then((response) => {
            const postsRes = res.data.result.reverse();
            const likeRes = response.data.result;

            const postWithLike = [];

            postsRes.forEach((post) => {
              postWithLike.push({ ...post, like: [] });
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
          })
          .catch((error) => {
            console.log(error.response.data);
            if (error.response.data.massage.includes("likes")) {
              const postsRes = res.data.result.reverse();

              const postWithLike = [];

              postsRes.forEach((post) => {
                postWithLike.push({ ...post, like: [] });
              });
              dispatch(setPosts(postWithLike));
              setShow(true);
            }
          });
      })
      .catch((error) => {
        setShow(false);
        console.log(error.response.data);
      });
  };
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
  //=================================

  const editProfile = () => {
    axios
      .put(`http://localhost:5000/user/${userId}`, {
        bio: updatebio,
        country: updatecountry,
        birthdate: updatebirthdate,
        image: urlImage,
        cover: urlCover,
      })
      .then((result) => {
        if (result.data.success) {
          getUserById(userId);
        }
        seturlCover("");
        seturlImage("");
      })
      .catch((error) => {
        {
          console.log(error.response.data);
        }
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

  const handelCheckUser = (id) => {
    if (id == userId) {
      navigate("/profile");
    } else {
      navigate(`/users/${id}`);
    }
  };

  //=================================

  const likePost = (postId) => {
    axios
      .post(
        `http://localhost:5000/likes/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        dispatch(addLike({ post_id: postId }));
        getPostByUserId(userId);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  // ==========================
  const unLikePost = (postId) => {
    axios
      .delete(`http://localhost:5000/likes/delete/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(removeLike({ post_id: postId }));
        getPostByUserId(userId);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  //=================================

  const unFollowFriend = (id) => {
    axios
      .delete(`http://localhost:5000/user/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(deleteFriendById(id));
        getAllFriends();
      })
      .catch((error) => {
        console.log(error);
      });
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

  // ==================================
  const uploadCover = () => {
    const data = new FormData();

    data.append("file", coverRef.current);
    data.append("upload_preset", "olfkj7in");
    data.append("cloud_name", "aa");
    fetch("https://api.cloudinary.com/v1_1/dviqtfdwx/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())

      .then((data) => {
        seturlCover(data.url);
      })
      .catch((err) => console.log(err));
  };

  // ==================================

  const uploadUserImage = () => {
    const data = new FormData();

    data.append("file", profileRef.current);
    data.append("upload_preset", "olfkj7in");
    data.append("cloud_name", "aa");
    fetch("https://api.cloudinary.com/v1_1/dviqtfdwx/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        seturlImage(data.url);
      })
      .catch((err) => console.log(err));
  };

  const resize = (e) => {
    const textarea = document.getElementById(e.target.id);
    textarea.style.height = "8vh";
    let scHeight = e.target.scrollHeight;
    textarea.style.height = `${scHeight - 0}px`;
  };

  const resizeComment = (e) => {
    const textarea = document.getElementById(e.target.id);
    textarea.style.height = "40px";
    let scHeight = e.target.scrollHeight;
    textarea.style.height = `${scHeight - 0}px`;
  };

  useEffect(() => {
    getUserById(userId);
    getPostByUserId(userId);
    getAllFriends();
    getAllComments();
  }, []);

  return (
    <div className="post-container">
      {/* ====================== */}
      <div className="profile-header">
        {urlCover ? (
          <div className="cover-choice">
            <p>Change Cover?</p>
            <div className="choices">
              <button
                className="cancel-cover"
                onClick={() => {
                  seturlCover("");
                }}
              >
                Cancel
              </button>
              <button className="cover-save" onClick={editProfile}>
                Save changes
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="header-container">
          <div className="cover">
            {users.map((el) => {
              return (
                <div key={el.id}>
                  {urlCover ? (
                    <img className="cover-img" src={urlCover} />
                  ) : (
                    <img className="cover-img" src={el.cover} />
                  )}
                </div>
              );
            })}

            <label htmlFor="cover-input" className="cover-input-label">
              <input
                id="cover-input"
                hidden
                type="file"
                onChange={(e) => {
                  coverRef.current = e.target.files[0];
                  uploadCover();
                }}
              />
              <ImCamera className="camera" /> Edit cover photo
            </label>
          </div>
          {/* ================================= */}
          <div className="profile-container">
            <div className="profile-left">
              <div className="profile">
                {users.map((el) => {
                  return (
                    <div className="img-container" key={el.id}>
                      <img className="image-photo" src={el.image} />
                    </div>
                  );
                })}

                <label htmlFor="profile-input" className="profile-input-label">
                  <input
                    id="profile-input"
                    type="file"
                    hidden
                    onChange={(e) => {
                      profileRef.current = e.target.files[0];
                      uploadUserImage();
                    }}
                  />
                  <ImCamera className="camera-profile" />
                </label>
              </div>
              <h1>{jwt_decode(token).userName}</h1>
            </div>
          </div>
          {urlImage ? (
            <div className="profile-change">
              <img className="profile-new" src={urlImage} />
              <div className="cover-choice">
                <p>Change profile picture?</p>
                <div className="choices-profile choices">
                  <button
                    className="cancel-cover cancel-profile"
                    onClick={() => {
                      seturlImage("");
                    }}
                  >
                    Cancel
                  </button>
                  <button className="cover-save" onClick={editProfile}>
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* ================================= */}
      <div className="main-container">
        <div className="left-container"></div>
        <div className="mid-container">
          {PopupIntro ? (
            <div className="info-popup">
              <div className="popup-header">
                <h1>Edit details </h1>
                <IoCloseSharp
                  className="close-btn close-info"
                  onClick={() => {
                    setPopupIntro(false);
                  }}
                />
              </div>
              <hr />
              {users.map((user, i) => {
                return (
                  <div className="info-div" key={i}>
                    <div className="detalis-conatiner">
                      <label className="info-label">Bio :</label>
                      <textarea
                        defaultValue={user.bio}
                        id={`textareabio`}
                        placeholder="Describe who you are"
                        onChange={(e) => setUpdateBio(e.target.value)}
                        onKeyUp={(e) => {
                          resize(e);
                        }}
                      ></textarea>
                    </div>
                    <div className="detalis-conatiner">
                      <label className="info-label">Country :</label>
                      <textarea
                        defaultValue={user.country}
                        placeholder="Where you from?"
                        id={`textareacountry`}
                        onChange={(e) => setUpdatecountry(e.target.value)}
                        onKeyUp={(e) => {
                          resize(e);
                        }}
                      ></textarea>
                    </div>
                    <div className="detalis-conatiner">
                      <label>Birthday :</label>
                      <input
                        className="birthdate"
                        type={"date"}
                        onChange={(e) => {
                          setUpdatebirthdate(e.target.value);
                        }}
                      />
                    </div>
                    <button
                      className="updateInfo"
                      onClick={() => {
                        setPopupIntro(false);
                        editProfile();
                      }}
                    >
                      Save changes
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            ""
          )}
          {PopupFriend ? (
            <div className="friends-popup">
              <div className="popup-header">
                <h1>Friends </h1>
                <IoCloseSharp
                  className="close-btn close-info"
                  onClick={() => {
                    setPopupFriend(false);
                  }}
                />
              </div>
              <hr />
              <div className="friendlist-scroll">
                {userFriends.length ? (
                  userFriends.map((friend, i) => {
                    return (
                      <div className="friend-div" key={i}>
                        <Link
                          className="friend-link link"
                          to={`/users/${friend.target_id}`}
                        >
                          <img className="friendimg" src={friend.image} />
                          <p>{friend.userName}</p>
                        </Link>
                        <button
                          className="follow-profile-popup"
                          onClick={() => {
                            unFollowFriend(friend.target_id);
                          }}
                        >
                          Unfollow
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p>You have no friends</p>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
          {/* INFO */}

          <div className="mid-left">
            <div className="info-left left">
              <h1>Intro</h1>
              {users.map((user, i) => {
                return (
                  <div className="details" key={i}>
                    {user.bio ? (
                      <>
                        <p className="bio-left">{user.bio}</p>
                        <div className="border"></div>
                      </>
                    ) : (
                      <button
                        className="edit-info with-icon"
                        onClick={() => {
                          setPopupIntro(true);
                        }}
                      >
                        Add Bio
                      </button>
                    )}

                    {user.country ? (
                      <div className="left-details">
                        <IoHomeSharp className="info-icon" />
                        <p>
                          Lives in <strong>{user.country}</strong>
                        </p>
                      </div>
                    ) : (
                      <button
                        className="edit-info with-icon"
                        onClick={() => {
                          setPopupIntro(true);
                        }}
                      >
                        Add country
                      </button>
                    )}

                    <div className="left-details">
                      <FaBirthdayCake className="info-icon" />
                      <p>
                        Born at{" "}
                        <strong>{user.birthdate.replaceAll("-", " / ")}</strong>
                      </p>
                    </div>
                  </div>
                );
              })}
              <button
                className="edit-info"
                onClick={() => {
                  setPopupIntro(true);
                  setPopupFriend(false);
                }}
              >
                Edit details
              </button>
              {/* INFO */}

              {/* FRIENDS */}
            </div>
            <div className="friend-left left">
              <div className="friend-left-header">
                <div>
                  <h1>Friends</h1>
                  <p>{userFriends.length} friends</p>
                </div>

                <button
                  onClick={(e) => {
                    setPopupFriend(true);
                    setPopupIntro(false);
                  }}
                >
                  See all friends
                </button>
              </div>

              <div className="friendlist">
                {friends.length ? (
                  friends.map((friend, i) => {
                    return (
                      <div key={i}>
                        <Link
                          className="friend-link link"
                          to={`/users/${friend.target_id}`}
                        >
                          <img className="friendimg" src={friend.image} />
                          <p>{friend.userName}</p>
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <p>You have no friends</p>
                )}
              </div>
            </div>
            {/* FRIENDS */}
          </div>

          {/* Posts */}
          <div className="mid-right">
            {" "}
            <div className="post-container">
              <div className="share">
                <div
                  className="shareWrapper"
                  onClick={() => {
                    setShowPostPopup(true);
                  }}
                >
                  <div className="shareTop">
                    {show &&
                      users.map((user, index) => {
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
                      }?`}
                      className="shareInput"
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                  <hr className="shareHr"></hr>
                  <div className="shareBottom">
                    <div className="shareOptions">
                      <div className="shareOption">
                        <label
                          htmlFor="post-img-icon"
                          className="label-post-img"
                        >
                          <input hidden id="post-img-icon" />
                          <MdOutlinePermMedia className="shareIcon" />
                          <span className="shareOptionText">Photo</span>
                        </label>
                      </div>
                      <button className="shareButton">Add</button>
                    </div>
                  </div>
                </div>
                <div
                  className={showPostPopup ? "post-popup-add-profile" : "hide"}
                >
                  <div className="updateheader">
                    <div className="update-post-header">
                      <h1>Create post</h1>
                      <IoCloseSharp
                        className="close-btn"
                        onClick={() => {
                          document.querySelector("body").style.overflowY =
                            "scroll";
                          setShowPostPopup(false);
                        }}
                      />
                    </div>
                  </div>
                  <form ref={addPostRef} className="addPost" onSubmit={newPost}>
                    <div className="pop-top">
                      <div className="pop-header">
                        <img
                          style={{ cursor: "default" }}
                          className="shareProfileImg"
                          alt=""
                          src={jwt_decode(token).image}
                        />
                        <p>
                          <stong>{jwt_decode(token).userName}</stong>
                        </p>
                      </div>

                      <input
                        placeholder={`What's on your mind ${
                          jwt_decode(token).firstName
                        }?`}
                        className="shareInput pop-in"
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>

                    <div className="image-post-container">
                      <img
                        className="iamge-post"
                        src={
                          postUrl ||
                          "https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_960_720.png"
                        }
                      />
                      <IoCloseSharp
                        className="close-btn cancel"
                        onClick={() => {
                          setPostUrl("");
                        }}
                      />
                    </div>
                    <br />
                    <div className="shareBottom bottom-popup">
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
              {/* <div className="share">
                <div className="shareWrapper">
                  <form ref={addPostRef} className="addPost" onSubmit={newPost}>
                    <div className="shareTop">
                      {show &&
                        users.map((user, index) => {
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
              </div> */}
              <div className="container-post">
                {" "}
                {show &&
                  posts.map((post, index) => {
                    return (
                      <div key={index}>
                        <div className="post">
                          <div className="postWrapper">
                            <div className="postTop">
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
                                        <img
                                          className="Icon"
                                          src={user.image}
                                        />
                                        <p>{user.userName} </p>
                                      </div>
                                    </div>
                                  );
                                }
                              })}

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
                            </div>
                            <div className="postCenter">
                              <p>{post.content}</p>
                              <div className="img-post-conatiner">
                                {post.image ? <img src={post.image} /> : ""}
                              </div>
                            </div>
                            <div>
                              {post.id == dropdownId && showUpdate ? (
                                <div className={"update-post-popup"}>
                                  <div className="updateheader">
                                    <div className="update-post-header">
                                      <h1>Update post</h1>
                                      <IoCloseSharp
                                        className="close-btn"
                                        onClick={() => {
                                          setShowUpdate(false);
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <form
                                    ref={addPostRef}
                                    className="addPost"
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      setShowUpdate(false);

                                      editpost(post.id, post.image);
                                    }}
                                  >
                                    <div className="pop-top">
                                      <div className="pop-header">
                                        <img
                                          style={{ cursor: "default" }}
                                          className="shareProfileImg"
                                          alt=""
                                          src={jwt_decode(token).image}
                                        />
                                        <p>
                                          <stong>
                                            {jwt_decode(token).userName}
                                          </stong>
                                        </p>
                                      </div>

                                      <input
                                        className="shareInput pop-in"
                                        defaultValue={post.content}
                                        onChange={(e) => {
                                          setUpdatecontent(e.target.value);
                                        }}
                                      />
                                    </div>

                                    <div className="image-post-container">
                                      <img
                                        className="iamge-post"
                                        src={
                                          postEditUrl ||
                                          "https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_960_720.png"
                                        }
                                      />
                                      <IoCloseSharp
                                        className="close-btn cancel"
                                        onClick={() => {
                                          setPostEditUrl("");
                                        }}
                                      />
                                    </div>
                                    <br />
                                    <div className="shareBottom bottom-popup">
                                      <div className="shareOptions">
                                        <div className="shareOption">
                                          <label
                                            htmlFor="update-post-image"
                                            className="label-post-img"
                                          >
                                            <input
                                              hidden
                                              id="update-post-image"
                                              type="file"
                                              onChange={(e) => {
                                                imageEditRef.current =
                                                  e.target.files[0];
                                                editPostImage();
                                              }}
                                            />
                                            <MdOutlinePermMedia className="shareIcon" />
                                            <span className="shareOptionText">
                                              Photo
                                            </span>
                                          </label>
                                        </div>
                                        <button
                                          className="shareButton"
                                          style={{ width: "150px" }}
                                        >
                                          Save Changes
                                        </button>
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              ) : (
                                // <div className={"update-post-popup"}>
                                //   <div className="updateheader">
                                //     <div className="update-post-header">
                                //       <h2>Update post</h2>
                                //       <IoCloseSharp
                                //         className="close-btn"
                                //         onClick={() => setShowUpdate(false)}
                                //       />
                                //     </div>{" "}
                                //   </div>
                                //   <form
                                //     className="update-form"
                                //     onSubmit={(e) => {
                                //       e.preventDefault();
                                //       setShowUpdate(false);

                                //       editpost(post.id, post.image);
                                //     }}
                                //     ref={formRef}
                                //   >
                                //     <input
                                //       className="textUpdate"
                                //       defaultValue={post.content}
                                //       onChange={(e) => {
                                //         setUpdatecontent(e.target.value);
                                //       }}
                                //     />

                                //     <img
                                //       className="iamge-post"
                                //       src={
                                //         postEditUrl ||
                                //         "https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_960_720.png"
                                //       }
                                //     />
                                //     <label
                                //       htmlFor="update-post-image"
                                //       className="update-post-image-label"
                                //     >
                                //       <input
                                //         id="update-post-image"
                                //         hidden
                                //         type="file"
                                //         onChange={(e) => {
                                //           imageEditRef.current =
                                //             e.target.files[0];
                                //           editPostImage();
                                //         }}
                                //       />
                                //       <FcUpload className="Fc" />
                                //       Upload Image
                                //     </label>
                                //     <button className="update--Post">
                                //       Update
                                //     </button>
                                //   </form>
                                // </div>
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
                                      className="like  comment-btn"
                                      onClick={(e) => {
                                        post.like.includes(userId)
                                          ? unLikePost(post.id)
                                          : likePost(post.id, post.user_id);
                                      }}
                                    >
                                      {post.like.includes(userId) ? (
                                        <div className="iconUnlike">
                                          <AiFillLike className="Unlike like-icon" />{" "}
                                          Like
                                        </div>
                                      ) : (
                                        <div className="iconUnlike">
                                          <AiFillLike className="like-icon" />{" "}
                                          Like
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
                                        <img
                                          className="Icon"
                                          src={user.image}
                                        />
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
                                        resizeComment(e);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          const commentSection =
                                            document.getElementById(
                                              `comment-${
                                                e.target.id.split("-")[1]
                                              }`
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
                                                {comment.commenter_id ==
                                                userId ? (
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
                                                      className="commentName"
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
                                                  setupdatecomment(
                                                    e.target.value
                                                  );
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
                {!posts.length ? <h1>No posts</h1> : ""}
              </div>
            </div>
          </div>
          {/* Posts */}
          {/* About */}
          <div className="about"></div>

          {/* Friends */}
          <div className="friends"></div>
        </div>
        <div className="right-container"></div>
      </div>
    </div>
  );
};

export default Profile;
