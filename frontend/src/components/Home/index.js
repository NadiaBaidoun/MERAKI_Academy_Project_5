import React, { useState } from "react";
import Login from "../Login";
import Register from "../Register";
import "./style.css";

const Home = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="Home">
      <div className="home-elements">
        <div className="facebook-logo">
          <h1>facebook</h1>
          <p>Connect with friends and the world around you on Facebook.</p>
        </div>

        <div className="home-actions">
          <Login />
          <button
            onClick={(e) => {
              setShow(true);
            }}
          >
            Create new account
          </button>
          {show ? (
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
