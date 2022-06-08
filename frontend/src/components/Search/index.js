import React, { useState } from "react";

import axios from "axios";

import { setUserName } from "../Redux/reducers/users";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";



const Search = () => {
  const [name, setName] = useState("");

  const { token } = useSelector((state) => {
    return {
      token: state.auth.token,
    };
  });

  //=================================
  const dispatch = useDispatch();

  const getUserByName = () => {
    axios
      .get(`http://localhost:5000/user/search/${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log(result);
        if (result.data.success) {
          dispatch(setUserName(result.data.result));
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  return (
    <div className="user-container">
      <input
        type={"search"}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <Link
        to={"/search/users"}
        className="link"
        onClick={() => {
          name ? getUserByName() : <></>;
        }}
      >
        SEARCH
      </Link>
    </div>
  );
};
export default Search;
