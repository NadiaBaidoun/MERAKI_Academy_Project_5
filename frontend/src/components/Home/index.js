import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import { setPosts } from "../Redux/reducers/post";
// import {
//   addTasks,
//   completeTask,
//   deleteTaskById,
//   setTasks,
//   updateTaskById,
// } from "../Redux/reducers/tasks";

// import jwt_decode from "jwt-decode";

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [open, setOpen] = useState(false);

  const [dropdownId, setDropdownId] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");

  const formRef = useRef("");
  //=================================
  const dispatch = useDispatch();

  //   const { token } = useSelector((state) => {
  //     return {
  //       token: state.auth.token,
  //     };
  //   });
  const { posts } = useSelector((state) => {
    return {
      posts: state.post.posts,
    };
  });

  const token1 =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImZpcnN0TmFtZSI6IkZhcmVzIiwibGFzdE5hbWUiOiJBaG1hZCIsInJvbGUiOjIsImlhdCI6MTY1NDE5MDkyMX0.6jPMBN39FGpIOj3g_0j976eDpAmAhsngoIQ2zu5LMyw";

  //   const role_id = jwt_decode(token).role;

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

  //   const showDD = (e) => {
  //     setOpen(!open);
  //     setDropdownId(e.target.id);
  //   };
  //   //=================================

  //   const newTask = async (e) => {
  //     e.preventDefault();
  //     axios
  //       .post(
  //         "http://localhost:5000/tasks",
  //         { title },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         if (res.data.success) {
  //           dispatch(addTasks({ title }));
  //           getAllTasks();
  //           formRef.current.reset();
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error.response.data.message);
  //       });
  //   };
  //   //=================================

  //   const updateForm = (e, tasktitle) => {
  //     setShowUpdate(!showUpdate);
  //     setDropdownId(e.target.id);
  //     setUpdateTitle(tasktitle);
  //     setOpen(!open);
  //   };

  //   //=================================

  //   const editTask = (id) => {
  //     axios
  //       .put(`http://localhost:5000/tasks/${id}`, {
  //         title: updateTitle,
  //       })
  //       .then((result) => {
  //         if (result.data.success) {
  //           dispatch(updateTaskById({ title: updateTitle, id }));
  //         }
  //       })
  //       .catch((error) => {
  //         {
  //           console.log(error);
  //         }
  //       });
  //   };
  //   //=================================

  //   const checkTask = (id) => {
  //     axios
  //       .put(`http://localhost:5000/tasks/${id}/complete`)
  //       .then((result) => {
  //         dispatch(completeTask(id));
  //       })
  //       .catch((error) => {
  //         {
  //           console.log(error.response.data.message);
  //         }
  //       });
  //   };
  //   //=================================
  //   const deleteTask = (id) => {
  //     axios
  //       .delete(`http://localhost:5000/tasks/${id}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((result) => {
  //         dispatch(deleteTaskById(id));
  //       })
  //       .catch((error) => {
  //         {
  //           console.log(error.response.data.message);
  //         }
  //       });
  //   };

  useEffect(() => {
    getAllPosts();
  }, []);
  return (
    <div className="post-container">
      {/* <form ref={formRef} onSubmit={newTask} className="addTask">
        <input
          type={"text"}
          placeholder="Add task..."
          onChange={(e) => setTitle(e.target.value)}
        />
        <button>Add</button>
      </form> */}
      {show &&
        posts.map((post, index) => {
          return (
            <div key={index} className="post">
              <p>{post.content}</p>
            </div>
          );
        })}
      {!posts.length ? <h1>No posts</h1> : ""}
    </div>
  );
};

export default Dashboard;
