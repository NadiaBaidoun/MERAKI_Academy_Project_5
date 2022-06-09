import React, { useEffect, useState, useRef } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../Redux/reducers/posts";

import "./style.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { addLike, setLikes } from "../Redux/reducers/like";
import jwt_decode from "jwt-decode";
import { setUsers } from "../Redux/reducers/users";
// import { setFriends } from "../Redux/reducers/friends";

import {
  addComment,
  setComments,
  updateCommentById,
  deleteCommentById,
} from "../Redux/reducers/comments";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const [dropdownIdCom, setDropdownIdCom] = useState("");
  const [updatecomment, setupdatecomment] = useState("");
  const [userFriends, setUserFriends] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [open, setOpen] = useState(false);

  const [dropdownId, setDropdownId] = useState("");

  const { id } = useParams();

  const [liked, setLiked] = useState(false);

  const formRef = useRef("");
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

  const { users } = useSelector((state) => {
    return {
      users: state.users.users,
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

  const getAllFriends = () => {
    axios
      .get(`http://localhost:5000/user/list/friends/${id}`, {
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

        setUserFriends(userFriends);
      })
      .catch((error) => {
        setUserFriends([]);
        console.log(error.response.data);
      });
  };

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
      .then((result) => {
        if (result.data.success) {
          dispatch(setPosts(result.data.result.reverse()));
          setShow(true);
        }
      })
      .catch((error) => {
        setShow(false);
        console.log(error.response.data.message);
      });
  };
  //=================================
  const getUserById = (id) => {
    console.log(id);
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

  const updateForm = (e, postcontent) => {
    setShowUpdate(!showUpdate);
    setDropdownId(e.target.id);
    setOpen(!open);
  };

  const showDD = (e) => {
    setOpen(!open);
    setDropdownId(e.target.id);
  };

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

  const getAllLikes = async () => {
    axios
      .get(`http://localhost:5000/likes`)
      .then((result) => {
        dispatch(setLikes(result.data.result));
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  //=================================

  const likePost = async (id) => {
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
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  //=================================

  useEffect(() => {
    getUserById(id);
    getPostByUserId(id);
    getAllLikes();
    getAllFriends();
    getMyFriends();
  }, []);

  return (
    <div className="post-container">
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
          <br />
          <div>Friend List</div>
          {/* {friends.length ? (
            friends.map((friend, i) => {
              console.log(friend);
              return (
                <div key={i}>
                  <p>{friend.userName}</p>
                </div>
              );
            })
          ) : (
            <p>You have no friends</p>
          )} */}
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
                {!liked ? (
                  <button
                    className="like"
                    onClick={(e) => {
                      likePost(post.id);
                    }}
                  >
                    Like
                  </button>
                ) : (
                  <button className="like">Unlike</button>
                )}

                {
                  likes.filter((el) => {
                    return el.post_id == post.id;
                  }).length
                }
              </div>
              <div className="comment-div">
                <div className="comment-container">
                  <h1>
                    {users.firstName} {users.lastName}
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
                                      showDD(e);
                                    }}
                                  >
                                    <BsThreeDotsVertical
                                      id={comment.id}
                                      onClick={(e) => {
                                        showDD(e);
                                      }}
                                    />
                                  </button>
                                  {open && dropdownId == comment.id ? (
                                    <div className="dropdown">
                                      <div
                                        className="options-div"
                                        id={comment.id}
                                        onClick={(e) => {
                                          updateForm(e, comment.comment);
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
                              <h3>{comment.userName}</h3>
                              <p className="comment">{comment.comment}</p>

                              {/* {comment.commenter_id === userId ? (
                                <>
                                  <button
                                    id={comment.id}
                                    onClick={(e) => {
                                      updateFormComment(e, comment.comment);
                                    }}
                                  >
                                    Update
                                  </button>
                                  <button
                                    id={comment.id}
                                    onClick={(e) => {
                                      deleteComment(e.target.id);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </>
                              ) : (
                                ""
                              )} */}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        {comment.id == dropdownIdCom && showUpdate ? (
                          <form
                            className="update-form"
                            onSubmit={(e) => {
                              e.preventDefault();
                              setShowUpdate(false);
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

export default UserProfile;
