import React, { useEffect, useState, useRef } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addPost,
  deletePostById,
  setPosts,
  updatePostById,
} from "../Redux/reducers/posts";

import "./style.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { addLike, removeLike, setLikes } from "../Redux/reducers/like";
import jwt_decode from "jwt-decode";
import { setUsers, updateUserById } from "../Redux/reducers/users";
import { deleteFriendById, setFriends } from "../Redux/reducers/friends";
import { IoMdCloseCircle } from "react-icons/io";
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

  const [dropdownId, setDropdownId] = useState("");

  const [updatecountry, setUpdatecountry] = useState("");
  const [userFriends, setUserFriends] = useState([]);

  // );
  const [updatebirthdate, setUpdatebirthdate] = useState("");
  const [updatebio, setUpdateBio] = useState("");
  const [liked, setLiked] = useState(false);
  // const [users, setUsers] = useState([]);

  const formRef = useRef("");
  const imageRef = useRef("");
  const coverRef = useRef("");
  const profileRef = useRef("");

  const [url, setUrl] = useState("");

  const [urlCover, seturlCover] = useState("");
  const [urlImage, seturlImage] = useState("");
  //======================================
  const Navigate = useNavigate();
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

    axios
      .post(
        "http://localhost:5000/posts/",
        { content, image: url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          dispatch(addPost({ content, image: url }));
          getPostByUserId(userId);
          formRef.current.reset();
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
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

  const newComment = async (e, id) => {
    e.preventDefault();
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
          getAllComments();
          formRef.current.reset();
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
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
        console.log(error.response.data.massage);
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
      })
      .catch((error) => {
        {
          console.log(error.response.data);
        }
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
        setUrl(data.url);
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

  useEffect(() => {
    getUserById(userId);
    getPostByUserId(userId);
    getAllFriends();
    getAllComments();
  }, []);

  return (
    <div className="post-container">
      {PopupFriend ? (
        <div className="popup">
          <button
            className="close"
            onClick={() => {
              setPopupFriend(false);
            }}
          >
            <IoMdCloseCircle
              onClick={() => {
                setPopupFriend(false);
              }}
            />
          </button>
          )
          {friends.length ? (
            friends.map((friend, i) => {
              return (
                <div className="firend" key={i}>
                  <p>{friend.userName} </p>
                  <img className="friendimg" src={friend.image} />
                  <button
                    className="like"
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
      ) : (
        ""
      )}

      <div className="cover">
        {users.map((el) => {
          return <img key={el.id} src={el.cover} />;
        })}
        <div>
          <input
            type="file"
            onChange={(e) => {
              coverRef.current = e.target.files[0];
              uploadCover();
            }}
          />

          <button onClick={editProfile}>UPDATE COVER</button>
        </div>
      </div>
      <div className="profilePic">
        {users.map((el) => {
          return <img key={el.id} src={el.image} />;
        })}
        <input
          type="file"
          onChange={(e) => {
            profileRef.current = e.target.files[0];
            uploadUserImage();
          }}
        />

        <button onClick={editProfile}>UpdatePhoto</button>
      </div>
      <h1>
        {jwt_decode(token).firstName} {jwt_decode(token).lastName}
      </h1>
      <div className="post-container">
        <form ref={formRef} onSubmit={newPost} className="addPost">
          <h1>
            {jwt_decode(token).firstName} {jwt_decode(token).lastName}
          </h1>
          <textarea
            placeholder="post description here"
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          <div className="post-action">
            <input
              type="file"
              onChange={(e) => {
                imageRef.current = e.target.files[0];
                uploadImage();
              }}
            />

            <button>Add</button>
          </div>
        </form>
      </div>
      <div className="left-info">
        <div className="left-container">
          <div className="INFO">
            <h1>Intro</h1>

            {users.map((user, i) => {
              return (
                <div key={i}>
                  <label>Bio :</label> <h1>{user.bio}</h1>
                  <label>Country :</label> <p>{user.country} </p>
                  <label>Birthdate :</label> <p>{user.birthdate}</p>
                </div>
              );
            })}
            <button
              onClick={() => {
                setPopupIntro(true);
              }}
            >
              Edit details
            </button>
            {PopupIntro ? (
              <div className="popup">
                <button
                  className="close"
                  onClick={() => {
                    setPopupIntro(false);
                  }}
                >
                  <IoMdCloseCircle
                    onClick={() => {
                      setPopupIntro(false);
                    }}
                  />
                </button>
                {users.map((user, i) => {
                  return (
                    <div key={i}>
                      <label>Bio :</label>
                      <textarea
                        defaultValue={user.bio}
                        onChange={(e) => setUpdateBio(e.target.value)}
                      ></textarea>
                      <label>Country :</label>
                      <textarea
                        defaultValue={user.country}
                        onChange={(e) => setUpdatecountry(e.target.value)}
                      ></textarea>
                      <label>Birthdate :</label>
                      <input
                        type={"date"}
                        onChange={(e) => {
                          setUpdatebirthdate(e.target.value);
                        }}
                      />
                      <button
                        className="updateInfo"
                        onClick={() => {
                          setPopupIntro(false);
                          editProfile();
                        }}
                      >
                        update
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </div>
          <br />
          <div>
            <h1> Friend List</h1>
          </div>
          <div>
            <button
              onClick={(e) => {
                setPopupFriend(true);
              }}
            >
              see allFriends
            </button>
          </div>
          {friends.length ? (
            friends.map((friend, i) => {
              return (
                <div className="firend" key={i}>
                  <Link
                    style={{ color: "black" }}
                    className="link"
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
      {show &&
        posts.map((post, index) => {
          return (
            <div key={index}>
              <div className="post">
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

                <img className="prof_img" src={post.image} />

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
              <div className="like-div">
                {post.like ? (
                  <>
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
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className="comment-div">
                <div className="comment-container">
                  <h1>
                    {jwt_decode(token).firstName} {jwt_decode(token).lastName}
                  </h1>
                  <form ref={formRef} className="addComment">
                    <textarea
                      placeholder="comment  here"
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                    ></textarea>
                    <div className="comment-action">
                      <button
                        onClick={(e) => {
                          newComment(e, post.id);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </form>
                </div>
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
                                          updateFormComment(e, comment.comment);
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
                                  onClick={() => {
                                    window.scrollTo(0, 0);
                                  }}
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
            </div>
          );
        })}
      {!posts.length ? <h1>No posts</h1> : ""}
    </div>
  );
};

export default Profile;
