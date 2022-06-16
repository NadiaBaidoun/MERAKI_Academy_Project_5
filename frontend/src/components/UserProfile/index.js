import React, { useEffect, useState, useRef } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../Redux/reducers/posts";

import "./style.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { addLike, removeLike, setLikes } from "../Redux/reducers/like";
import jwt_decode from "jwt-decode";
import { setUsers } from "../Redux/reducers/users";
import { setFriends } from "../Redux/reducers/friends";
import { IoHomeSharp } from "react-icons/io5";
import { FaBirthdayCake } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

import {
  addComment,
  setComments,
  updateCommentById,
  deleteCommentById,
} from "../Redux/reducers/comments";
import { useParams, Link } from "react-router-dom";

const UserProfile = () => {
  const [dropdownIdCom, setDropdownIdCom] = useState("");
  const [userFriends, setUserFriends] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [PopupFriend, setPopupFriend] = useState(false);
  const [showCommentUpdate, setShowCommentUpdate] = useState(false);

  const [dropdownIdComment, setDropdownIdComment] = useState("");

  const [updatecomment, setupdatecomment] = useState("");

  const [dropdownId, setDropdownId] = useState("");

  const { id } = useParams();

  const [liked, setLiked] = useState(false);

  const formRef = useRef("");
  const imageRef = useRef("");
  const coverRef = useRef("");
  const profileRef = useRef("");
  const addCommentRef = useRef("");

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

  // const { users } = useSelector((state) => {
  //   return {
  //     users: state.users.users,
  //   };
  // });

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

  //=================================

  // const getAllFriends = () => {
  //   axios
  //     .get(`http://localhost:5000/user/list/friends/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((result) => {
  //       const friendsRes = result.data.result;

  //       const userFriends = [];

  //       friendsRes.forEach((friend) => {
  //         userFriends.push(friend.target_id);
  //       });

  //       setUserFriends(userFriends);
  //     })
  //     .catch((error) => {
  //       setUserFriends([]);
  //       console.log(error.response.data);
  //     });
  // };

  const getAllFriends = () => {
    axios
      .get(`http://localhost:5000/user/list/friends/${id}`, {
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
    getAllFriends();
    getMyFriends();
  }, []);

  //   return (
  //     <div className="user-container">
  //       <div className="cover">
  //         {users.map((el) => {
  //           return <img key={el.id} src={el.cover} />;
  //         })}
  //       </div>
  //       <div className="profilePic" >
  //         {users.map((el) => {
  //           return <img key={el.id} src={el.image} />;
  //         })}
  //       </div>
  //       <div className="profilePic">
  //         {users.map((el, i) => {
  //           return (
  //             <div key={i}>
  //               <h1> {el.userName}</h1>
  //             </div>
  //           );
  //         })}
  //       </div>

  //       <button
  //         className="like"
  //         onClick={() => {
  //           myFriends.includes(parseInt(id))
  //             ? unFollowFriend(id)
  //             : followFriend(id);
  //         }}
  //       >
  //         {myFriends.includes(parseInt(id)) ? "Unfollow" : "Follow"}
  //       </button>

  //       <div className="post-container"></div>
  //       <div className="left-info">
  //         <div className="left-container">
  //           <div className="INFO">
  //             <h1>INFO</h1>
  //             {users.map((user, i) => {
  //               return (
  //                 <div key={i}>
  //                   {/* <input
  //                     defaultValue={users.bio}
  //                     onChange={(e) => {
  //                       setUpdateBio(e.target.value);
  //                     }}
  //                   /> */}
  //                   <h1>{user.bio}</h1>

  //                   <p>{user.country} </p>

  //                   <p>{user.birthdate}</p>

  //                   <div></div>
  //                 </div>
  //               );
  //             })}
  //           </div>
  //           <br />
  //           <div>Friend List</div>
  //           {/* {friends.length ? (
  //             friends.map((friend, i) => {
  //               console.log(friend);
  //               return (
  //                 <div key={i}>
  //                   <p>{friend.userName}</p>
  //                 </div>
  //               );
  //             })
  //           ) : (
  //             <p>You have no friends</p>
  //           )} */}
  //         </div>
  //       </div>
  //       {show &&
  //         posts.map((post, index) => {
  //           return (
  //             <div key={index}>
  //               <div className="post">
  //                 <div className="dd-container"></div>
  //                 <p>{post.content}</p>

  //                 <img className="prof_img" src={post.image} />
  //               </div>
  //               <div className="like-div">
  //                 {post.like ? (
  //                   <>
  //                     <button
  //                       className="like"
  //                       onClick={(e) => {
  //                         post.like.includes(userId)
  //                           ? unLikePost(post.id)
  //                           : likePost(post.id);
  //                       }}
  //                     >
  //                       {post.like.includes(userId) ? "Unlike" : "Like"}
  //                     </button>
  //                     <p>{post.like.length}</p>
  //                   </>
  //                 ) : (
  //                   ""
  //                 )}
  //               </div>
  //               <div className="comment-div">
  //                 <div className="comment-container">
  //                   <h1>
  //                     {jwt_decode(token).firstName} {jwt_decode(token).lastName}
  //                   </h1>
  //                   <form ref={formRef} className="addComment">
  //                     <textarea
  //                       placeholder="comment  here"
  //                       onChange={(e) => {
  //                         setComment(e.target.value);
  //                       }}
  //                     ></textarea>
  //                     <div className="comment-action">
  //                       <button
  //                         onClick={(e) => {
  //                           newComment(e, post.id);
  //                         }}
  //                       >
  //                         Add
  //                       </button>
  //                     </div>
  //                   </form>
  //                 </div>
  //                 {show &&
  //                   comments.map((comment, index) => {
  //                     return (
  //                       <div key={index}>
  //                         <div>
  //                           {post.id === comment.post_id ? (
  //                             <div className="comment-div-container">
  //                               {comment.commenter_id == userId ? (
  //                                 <div className="dd-comment">
  //                                   <button
  //                                     id={comment.id}
  //                                     className="dd-button"
  //                                     onClick={(e) => {
  //                                       showDDComment(e);
  //                                     }}
  //                                   >
  //                                     <BsThreeDotsVertical
  //                                       id={comment.id}
  //                                       onClick={(e) => {
  //                                         showDDComment(e);
  //                                       }}
  //                                     />
  //                                   </button>
  //                                   {openComment &&
  //                                   dropdownIdComment == comment.id ? (
  //                                     <div className="dropdown-comment">
  //                                       <div
  //                                         className="options-div"
  //                                         id={comment.id}
  //                                         onClick={(e) => {
  //                                           updateFormComment(e, comment.comment);
  //                                         }}
  //                                       >
  //                                         Update
  //                                       </div>

  //                                       <div
  //                                         className="options-div"
  //                                         id={comment.id}
  //                                         onClick={(e) => {
  //                                           deleteComment(e.target.id);
  //                                         }}
  //                                       >
  //                                         Delete
  //                                       </div>
  //                                     </div>
  //                                   ) : (
  //                                     <></>
  //                                   )}
  //                                 </div>
  //                               ) : (
  //                                 ""
  //                               )}
  //                               <h3>{comment.userName}</h3>
  //                               <p className="comment">{comment.comment}</p>
  //                             </div>
  //                           ) : (
  //                             ""
  //                           )}
  //                         </div>
  //                         {comment.id == dropdownIdComment &&
  //                         showCommentUpdate ? (
  //                           <form
  //                             className="update-form"
  //                             onSubmit={(e) => {
  //                               e.preventDefault();
  //                               setShowCommentUpdate(false);
  //                               editComment(comment.id);
  //                             }}
  //                             ref={formRef}
  //                           >
  //                             <input
  //                               defaultValue={comment.comment}
  //                               onChange={(e) => {
  //                                 setupdatecomment(e.target.value);
  //                               }}
  //                             />
  //                             <button>Update</button>
  //                           </form>
  //                         ) : (
  //                           ""
  //                         )}
  //                       </div>
  //                     );
  //                   })}
  //                 {!comments.length ? <h1>No comments</h1> : ""}
  //               </div>
  //             </div>
  //           );
  //         })}
  //       {!posts.length ? <h1>No posts</h1> : ""}
  //     </div>
  //   );
  // };

  // export default UserProfile;

  // import React, { useEffect, useState, useRef } from "react";

  // import axios from "axios";
  // import { useDispatch, useSelector } from "react-redux";
  // import {
  //   addPost,
  //   deletePostById,
  //   setPosts,
  //   updatePostById,
  // } from "../Redux/reducers/posts";

  // import "./style.css";
  // import { BsThreeDotsVertical } from "react-icons/bs";
  // import { addLike, removeLike, setLikes } from "../Redux/reducers/like";
  // import jwt_decode from "jwt-decode";
  // import { setUsers, updateUserById } from "../Redux/reducers/users";
  // import { deleteFriendById, setFriends } from "../Redux/reducers/friends";
  // import { IoMdCloseCircle } from "react-icons/io";
  // import { ImCamera } from "react-icons/im";

  // import { Link, useNavigate, useParams } from "react-router-dom";
  // import {
  //   addComment,
  //   setComments,
  //   updateCommentById,
  //   deleteCommentById,
  // } from "../Redux/reducers/comments";

  // const Profile = () => {
  //   const [content, setContent] = useState("");
  //   const [show, setShow] = useState(false);
  //   const [PopupFriend, setPopupFriend] = useState(false);
  //   const [PopupIntro, setPopupIntro] = useState(false);
  //   const [showUpdate, setShowUpdate] = useState(false);
  //   const [open, setOpen] = useState(false);

  //   const [dropdownId, setDropdownId] = useState("");

  //   const [updatecountry, setUpdatecountry] = useState("");
  //   const [userFriends, setUserFriends] = useState([]);

  //   const [updatebirthdate, setUpdatebirthdate] = useState("");
  //   const [updatebio, setUpdateBio] = useState("");

  //   const formRef = useRef("");
  //   const addCommentRef = useRef("");
  //   const imageRef = useRef("");
  //   const coverRef = useRef("");
  //   const profileRef = useRef("");

  //   const imageEditRef = useRef("");
  //   const [postEditUrl, setPostEditUrl] = useState("");

  //   const [postUrl, setPostUrl] = useState("");

  //   const [urlCover, seturlCover] = useState("");
  //   const [urlImage, seturlImage] = useState("");
  //   //======================================
  //   const Navigate = useNavigate();
  //   //=================================Comment================================
  //   const [openComment, setOpenComment] = useState(false);
  //   const [showCommentUpdate, setShowCommentUpdate] = useState(false);
  //   const [dropdownIdComment, setDropdownIdComment] = useState("");
  //   const [comment, setComment] = useState("");
  //   const [updatecontent, setUpdatecontent] = useState("");
  //   const [updatecomment, setupdatecomment] = useState("");
  //   const [myFriends, setMyFriends] = useState([]);
  //   //========================================================================
  //   const dispatch = useDispatch();

  //   const { posts } = useSelector((state) => {
  //     return {
  //       posts: state.posts.posts,
  //     };
  //   });

  //   const { users, friends } = useSelector((state) => {
  //     return {
  //       users: state.users.users,
  //       friends: state.friends.friends,
  //     };
  //   });
  //   const { comments } = useSelector((state) => {
  //     return {
  //       comments: state.comments.comments,
  //     };
  //   });

  //   const { likes } = useSelector((state) => {
  //     return {
  //       likes: state.like.likes,
  //     };
  //   });

  //   const { token } = useSelector((state) => {
  //     return {
  //       token: state.auth.token,
  //     };
  //   });

  //   const userId = jwt_decode(token).userId;

  //   const { id } = useParams();

  //   //=================================

  //   const showDD = (e) => {
  //     setOpen(!open);
  //     setDropdownId(e.target.id);
  //   };
  //   //=================================

  //   const followFriend = (id) => {
  //     axios
  //       .put(
  //         `http://localhost:5000/user/follow/${id}`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       )
  //       .then((result) => {
  //         getMyFriends();
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  //   //=================================

  //   const showDDComment = (e) => {
  //     setOpenComment(!openComment);
  //     setDropdownIdComment(e.target.id);
  //   };

  //   //=================================

  //   const updateFormComment = (e, commentcomment) => {
  //     setShowCommentUpdate(!showCommentUpdate);
  //     setDropdownIdComment(e.target.id);
  //     setupdatecomment(commentcomment);
  //     setOpenComment(!openComment);
  //   };

  //   //=================================

  //   const getAllComments = () => {
  //     axios
  //       .get(`http://localhost:5000/comments`)
  //       .then((result) => {
  //         dispatch(setComments(result.data.result));
  //       })
  //       .catch((error) => {
  //         console.log(error.response.data.message);
  //       });
  //   };

  //   //=================================

  //   const newComment = async (e, id) => {
  //     e.preventDefault();
  //     if (comment) {
  //       axios
  //         .post(
  //           `http://localhost:5000/comments/${id}`,
  //           { comment },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         )
  //         .then((res) => {
  //           if (res.data.success) {
  //             dispatch(addComment({ comment, post_id: id }));
  //             setComment("");
  //             getAllComments();
  //             addCommentRef.current.reset();
  //           }
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     }
  //   };

  //   //=================================

  //   const editComment = (id) => {
  //     axios
  //       .put(`http://localhost:5000/comments/update/${id}`, {
  //         comment: updatecomment,
  //       })
  //       .then((result) => {
  //         if (result.data.success) {
  //           dispatch(updateCommentById({ comment: updatecomment, id }));
  //         }
  //       })
  //       .catch((error) => {
  //         {
  //           console.log(error);
  //         }
  //       });
  //   };

  //   //=================================

  //   const deleteComment = (id) => {
  //     axios
  //       .delete(`http://localhost:5000/comments/delete/${id}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((result) => {
  //         dispatch(deleteCommentById(id));
  //       })
  //       .catch((error) => {
  //         {
  //           console.log(error.response.data.message);
  //         }
  //       });
  //   };

  //     const getMyFriends = () => {
  //     axios
  //       .get(`http://localhost:5000/user/list/friends/${userId}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((result) => {
  //         const friendsRes = result.data.result;

  //         const userFriends = [];

  //         friendsRes.forEach((friend) => {
  //           userFriends.push(friend.target_id);
  //         });

  //         setMyFriends(userFriends);
  //       })
  //       .catch((error) => {
  //         setMyFriends([]);
  //         console.log(error.response.data);
  //       });
  //   };

  //   //=================================

  //   const getAllFriends = () => {
  //     axios
  //       .get(`http://localhost:5000/user/list/friends/${userId}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })

  //       .then((result) => {
  //         const friendsRes = result.data.result;

  //         if (result.data.success) {
  //           let arrayofFriends = [];

  //           if (friendsRes.length > 6) {
  //             const filteredFriends = friendsRes.filter((el, i) => {
  //               return i <= 5;
  //             });
  //             arrayofFriends = [...filteredFriends];
  //           } else if (friendsRes.length <= 6) {
  //             arrayofFriends = [...friendsRes];
  //           }
  //           setUserFriends(friendsRes);
  //           dispatch(setFriends(arrayofFriends));
  //           setShow(true);
  //         }
  //       })
  //       .catch((error) => {
  //         dispatch(setFriends([]));
  //         console.log(error.response.data);
  //       });
  //   };
  //   //=================================

  //   const getPostByUserId = (id) => {
  //     axios
  //       .get(`http://localhost:5000/posts/user/${id}`)
  //       .then((res) => {
  //         axios
  //           .get(`http://localhost:5000/likes`)
  //           .then((response) => {
  //             const postsRes = res.data.result.reverse();
  //             const likeRes = response.data.result;

  //             const postWithLike = [];

  //             postsRes.forEach((post) => {
  //               postWithLike.push({ ...post, like: [] });
  //             });
  //             postWithLike.forEach((post) => {
  //               likeRes.forEach((like) => {
  //                 if (post.id == like.post_id) {
  //                   post.like.push(like.user_id);
  //                 }
  //               });
  //             });
  //             dispatch(setPosts(postWithLike));
  //             setShow(true);
  //           })
  //           .catch((error) => {
  //             if (error.response.data.massage.includes("likes")) {
  //               const postsRes = res.data.result.reverse();

  //               const postWithLike = [];

  //               postsRes.forEach((post) => {
  //                 postWithLike.push({ ...post, like: [] });
  //               });
  //               dispatch(setPosts(postWithLike));
  //               setShow(true);
  //             }
  //           });
  //       })
  //       .catch((error) => {
  //         setShow(false);
  //         console.log(error.response.data.massage);
  //       });
  //   };
  //   //=================================
  //   const getUserById = (id) => {
  //     axios
  //       .get(`http://localhost:5000/user/${id}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((result) => {
  //         if (result.data.success) {
  //           // setUsers(result.data.result);
  //           dispatch(setUsers(result.data.result));
  //           setShow(true);
  //         }
  //       })
  //       .catch((error) => {
  //         setShow(false);
  //         console.log(error.response.data.message);
  //       });
  //   };
  //   //=================================

  //   //=================================

  //   const updateForm = (e, postcontent) => {
  //     setShowUpdate(!showUpdate);
  //     setDropdownId(e.target.id);
  //     setUpdatecontent(postcontent);
  //     setOpen(!open);
  //   };

  //   //=================================

  //   const likePost = (postId) => {
  //     axios
  //       .post(
  //         `http://localhost:5000/likes/${postId}`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       )
  //       .then((result) => {
  //         dispatch(addLike({ post_id: postId }));
  //         getPostByUserId(userId);
  //       })
  //       .catch((error) => {
  //         console.log(error.response.data.message);
  //       });
  //   };
  //   // ==========================
  //   const unLikePost = (postId) => {
  //     axios
  //       .delete(`http://localhost:5000/likes/delete/${postId}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((result) => {
  //         dispatch(removeLike({ post_id: postId }));
  //         getPostByUserId(userId);
  //       })
  //       .catch((error) => {
  //         console.log(error.response.data.message);
  //       });
  //   };
  //   //=================================

  //   const unFollowFriend = (id) => {
  //     axios
  //       .delete(`http://localhost:5000/user/delete/${id}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((result) => {
  //         dispatch(deleteFriendById(id));
  //         getAllFriends();
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };
  //   //=================================

  //   useEffect(() => {
  //     getUserById(id);
  //     getPostByUserId(id);
  //     getAllFriends();
  //     getAllComments();
  //   }, []);

  return (
    <div className="post-container">
      {/* ====================== */}

      <div className="profile-header">
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
          </div>
          {/* ================================= */}
          <div className="profile-container">
            <div className="profile">
              {users.map((el) => {
                return (
                  <div className="img-container" key={el.id}>
                    <img className="image-photo" src={el.image} />
                    <div className="userProfileName">
                    {users.map((el) => {
                      return (
                        <h1 key={el.id}>
                          {el.firstName} {el.lastName}
                        </h1>
                      );
                    })}
                    </div>
                  </div>
                );
              })}

              {/* <button onClick={editProfile}>UpdatePhoto</button> */}
            </div>

           

          
              <button
                className="like follow"
                onClick={() => {
                  myFriends.includes(parseInt(id))
                    ? unFollowFriend(id)
                    : followFriend(id);
                }}
              >
                {myFriends.includes(parseInt(id)) ? "Unfollow" : "Follow"}
              </button>
            </div>
        </div>
      </div>

      {/* ================================= */}

      <div className="main-container">
        <div className="left-container"></div>
        <div className="mid-container">
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
                      <></>
                    )}

                    <div className="left-details">
                      <IoHomeSharp className="info-icon" />
                      <p>
                        Lives in <strong>{user.country}</strong>
                      </p>
                    </div>

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
          </div>

          <div className="mid-right">MIDDLE-RIGHT</div>

          <div className="about"></div>

          <div className="friends"></div>
        </div>
        <div className="right-container"></div>
      </div>

      {/* <div className="post-container"></div>
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
                <Link
                  style={{ color: "black" }}
                  className="link"
                  to={`/profile`}
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                >
                  <h3>
                    {jwt_decode(token).firstName} {jwt_decode(token).lastName}
                  </h3>
                </Link>
                <p>{post.content}</p>
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
        })}*/}
      {!posts.length ? <h1>No posts</h1> : ""}
    </div>
  );
};

export default UserProfile;
