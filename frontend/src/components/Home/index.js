import React, { useState } from "react";
import Login from "../Login";
import Register from "../Register";
import "./style.css";

import { useDispatch, useSelector } from "react-redux";
import { showForm } from "../Redux/reducers/auth";

const Home = () => {
  const dispatch = useDispatch();

  const { regForm } = useSelector((state) => {
    return {
      regForm: state.auth.regForm,
    };
  });

  return (
    <div className="Home">
      <div className="home-elements">
        <div className="facebook-logo">
          <h1>facebook</h1>
          <p>Connect with friends and the world around you on Facebook.</p>
        </div>

        <div className="home-actions">
          <Login />
          <div className="login-div"></div>

          <button
            className="register"
            onClick={(e) => {
              dispatch(showForm(true));
            }}
          >
            Create new account
          </button>
          {regForm ? (
            <div className="register-container">
              <Register />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
