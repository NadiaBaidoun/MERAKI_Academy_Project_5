import React, { useState, useRef } from "react";

import axios from "axios";
import "./style.css";

import { setUserName } from "../Redux/reducers/users";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Search = () => {
  const [name, setName] = useState("");
  // const nameRef = useRef("");

  const { token } = useSelector((state) => {
    return {
      token: state.auth.token,
    };
  });

  //=================================
  const dispatch = useDispatch();

  const getUserByName = () => {
    console.log(name);
    axios
      .get(`http://localhost:5000/user/search/${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (result.data.success) {
          dispatch(setUserName(result.data.result));
          setName("");
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  return (
    <div className="search-container">
      <input
        placeholder="Search"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />

      {name ? (
        <Link
          to={"/search/users"}
          className="link"
          onClick={() => {
            name ? getUserByName() : <></>;
          }}
        >
          SEARCH
        </Link>
      ) : (
        <Link to={{}} className="link">
          SEARCH
        </Link>
      )}
    </div>
  );
};
export default Search;
