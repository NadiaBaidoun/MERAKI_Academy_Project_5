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
import { addLike, setLikes } from "../Redux/reducers/like";
import jwt_decode from "jwt-decode";

const Profile = () => {
  const [content, setContent] = useState("");
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [open, setOpen] = useState(false);

  const [dropdownId, setDropdownId] = useState("");
  const [updatecontent, setUpdatecontent] = useState("");
  const [liked, setLiked] = useState(false);

  const formRef = useRef("");
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

  const userId = jwt_decode(token).userId;
  //=================================

  const newPost = async (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:5000/posts/",
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          dispatch(addPost({ content }));
          
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
  const getPostByUserId = (id) => {
    console.log(id);
    axios
      .get(`http://localhost:5000/posts/user/${id}`)
      .then((result) => {
        console.log(result);
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

  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  const uploadImage = () => {
    const data = new FormData();
    data.append("file", image);
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
  //=================================
  useEffect(() => {
    getPostByUserId(userId);
    getAllLikes();
  }, []);

  return (
    <div className="post-container">
      <div className="post-container">
        <h1>
          {jwt_decode(token).firstName} {jwt_decode(token).lastName}
        </h1>
        <div className="upload">
        {/* <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        ></input> */}
        {/* <button onClick={uploadImage}>Upload</button> */}
      </div>
      <div>
       
        <img className="prof_img"  src={url} />
      </div>
        <form ref={formRef}  onSubmit={ image? uploadImage : newPost }className="addPost">
          <textarea
            placeholder="article description here"
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <div className="post-action">
           
            <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}></input>
            <button  >Add</button>
           
          </div>
        </form>
      </div>
      <div className="left-info">
        <div className="left-container">
          <div>INFO</div>
          <div>Friend List</div>
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
                      console.log(post.id);
                      showDD(e);
                    }}
                  >
                    <BsThreeDotsVertical
                      id={post.id}
                      onClick={(e) => {
                        console.log(post.id);
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
            </div>
          );
        })}
      {!posts.length ? <h1>No posts</h1> : ""}
    </div>
  );
};

export default Profile;
