import React, { useEffect, useState, useRef } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../Redux/reducers/posts";

import "./style.css";
import { IoMdCloseCircle } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { addLike, removeLike, setLikes } from "../Redux/reducers/like";
import jwt_decode from "jwt-decode";
import { setUsers } from "../Redux/reducers/users";
// import { setFriends } from "../Redux/reducers/friends";

import {
  addComment,
  setComments,
  updateCommentById,
  deleteCommentById,
} from "../Redux/reducers/comments";
import { Link, useParams } from "react-router-dom";
import { deleteFriendById, setFriends } from "../Redux/reducers/friends";
const UserProfile = () => {
  const [dropdownIdCom, setDropdownIdCom] = useState("");
  const [userFriends, setUserFriends] = useState([]);
  const [PopupFriend, setPopupFriend] = useState(false);
  const [myFriends, setMyFriends] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [openComment, setOpenComment] = useState(false);

  const [showCommentUpdate, setShowCommentUpdate] = useState(false);

  const [dropdownIdComment, setDropdownIdComment] = useState("");

  const [updatecomment, setupdatecomment] = useState("");

  const [dropdownId, setDropdownId] = useState("");

  const { id } = useParams();

  const [liked, setLiked] = useState(false);

  const formRef = useRef("");
  const addCommentRef = useRef("");
  const imageRef = useRef("");
  const coverRef = useRef("");
  const profileRef = useRef("");

  const [url, setUrl] = useState("");

  const [urlCover, seturlCover] = useState("");
  const [urlImage, seturlImage] = useState("");

  //=================================
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

  // ======================================

  const unLikePost = (postId) => {
    axios
      .delete(`http://localhost:5000/likes/delete/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(removeLike({ post_id: postId }));
        getPostByUserId(id);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  //=================================

  const getMyFriends = () => {
    axios
      .get(`http://localhost:5000/user/list/friends/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        const friendsRes = result.data.result;

        const userFriends = [];

        friendsRes.forEach((friend) => {
          userFriends.push(friend.target_id);
        });

        setMyFriends(userFriends);
      })

      .catch((error) => {
        setMyFriends([]);
        console.log(error.response.data);
      });
  };
  //=================================

  const getUserFriends = () => {
    axios
      .get(`http://localhost:5000/user/friends/${id}`)
      .then((result) => {
        const friendsRes = result.data.result;
        console.log(friendsRes);

        // const userFriends = [];

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
          setUserFriends(arrayofFriends);
          // dispatch(setFriends(arrayofFriends));
          //         setShow(true);
        }
      })
      .catch((error) => {
        setUserFriends([]);
        console.log(error.response.data);
      });
  };

  //=================================

  const showDDComment = (e) => {
    setOpenComment(!openComment);
    setDropdownIdComment(e.target.id);
  };

  //=================================

  const updateFormComment = (e, commentcomment) => {
    setShowCommentUpdate(!showCommentUpdate);
    setDropdownIdComment(e.target.id);
    setupdatecomment(commentcomment);
    setOpenComment(!openComment);
  };

  // const getAllFriends = () => {
  //   axios
  //     .get(`http://localhost:5000/user/list/friends/${userId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })

  //     .then((result) => {
  //       const friendsRes = result.data.result;

  //       if (result.data.success) {
  //         let arrayofFriends = [];

  //         if (friendsRes.length > 6) {
  //           const filteredFriends = friendsRes.filter((el, i) => {
  //             return i <= 5;
  //           });
  //           arrayofFriends = [...filteredFriends];
  //         } else if (friendsRes.length <= 6) {
  //           arrayofFriends = [...friendsRes];
  //         }

  //         dispatch(setFriends(arrayofFriends));
  //         setShow(true);
  //       }
  //     })
  //     .catch((error) => {
  //       dispatch(setFriends([]));
  //       console.log(error.response.data);
  //     });
  // };
  //=================================

  const followFriend = (id) => {
    axios
      .put(
        `http://localhost:5000/user/follow/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        getMyFriends();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // ==========================
  const unFollowFriend = (id) => {
    console.log("ID", id);
    axios
      .delete(`http://localhost:5000/user/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        getMyFriends();
      })
      .catch((error) => {
        console.log(error);
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

  const newComment = (e, id) => {
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
          addCommentRef.current.reset();
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
        getPostByUserId(id);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  //=================================

  useEffect(() => {
    getUserById(id);
    getPostByUserId(id);
    getAllComments();
    getUserFriends();
    getMyFriends();
  }, [id]);

  return (
    <div className="user-container">
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
            <div className="friendlist">
              {userFriends.length ? (
                userFriends.map((friend, i) => {
                  return (
                    <div className="firend" key={i}>
                      <Link
                        to={`/users/${friend.target_id}`}
                        style={{ color: "black" }}
                        className="link"
                      >
                        <img className="friendimg" src={friend.image} />
                        {friend.userName}
                      </Link>
                      {friend.target_id === userId ? (
                        <></>
                      ) : (
                        <button
                          className="like"
                          onClick={() => {
                            myFriends.includes(friend.target_id)
                              ? unFollowFriend(friend.target_id)
                              : followFriend(friend.target_id);
                          }}
                        >
                          {myFriends.includes(friend.target_id)
                            ? "Unfollow"
                            : "Follow"}
                        </button>
                      )}
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

        <div className="cover">
          {users.map((el) => {
            return <img key={el.id} src={el.cover} />;
          })}
        </div>
        <div className="profilePic">
          {users.map((el) => {
            return <img key={el.id} src={el.image} />;
          })}
        </div>
        <div className="profilePic">
          {users.map((el, i) => {
            return (
              <div key={i}>
                <h1> {el.userName}</h1>
              </div>
            );
          })}
        </div>
        <button
          className="like"
          onClick={() => {
            myFriends.includes(parseInt(id))
              ? unFollowFriend(id)
              : followFriend(id);
          }}
        >
          {myFriends.includes(parseInt(id)) ? "Unfollow" : "Follow"}
        </button>

        <div className="post-container"></div>
        <div className="left-info">
          <div className="left-container">
            <div className="INFO">
              <h1>INFO</h1>
              {users.map((user, i) => {
                return (
                  <div key={i}>
                    {/* <input
                    defaultValue={users.bio}
                    onChange={(e) => {
                      setUpdateBio(e.target.value);
                    }}
                  /> */}
                    <h1>{user.bio}</h1>

                    <p>{user.country} </p>

                    <p>{user.birthdate}</p>

                    <div></div>
                  </div>
                );
              })}
            </div>
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
            {userFriends.length ? (
              userFriends.map((friend, i) => {
                return (
                  <div className="firend" key={i}>
                    {friend.target_id === userId ? (
                      <Link
                        to={`/profile`}
                        style={{ color: "black" }}
                        className="link"
                      >
                        <img className="friendimg" src={friend.image} />
                        <p>{friend.userName}</p>
                      </Link>
                    ) : (
                      <Link
                        to={`/users/${friend.target_id}`}
                        style={{ color: "black" }}
                        className="link"
                      >
                        <img className="friendimg" src={friend.image} />
                        <p>{friend.userName}</p>
                      </Link>
                    )}
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
                  <div className="dd-container"></div>
                  <p>{post.content}</p>

                  <img className="prof_img" src={post.image} />
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
                    </>
                  ) : (
                    ""
                  )}
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
        {!posts.length ? <h1>No posts</h1> : ""}
      </div>
    </div>
  );
};

export default UserProfile;