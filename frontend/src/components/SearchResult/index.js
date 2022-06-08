import React, { useEffect, useState } from "react";

import "./style.css";

const SearchResult = () => {
  const { users } = useSelector((state) => {
    return {
      users: state.users.users,
    };
  });

  return (
    <div className="user-container">
      {users.length &&
        users.map((user, index) => {
          return (
            <div key={index}>
              <div className="user">
                <h2>{user.userName}</h2>
                {/* <img className="prof_img" src={user.image} /> */}
              </div>
            </div>
          );
        })}
      {!users.length ? <h1>No users</h1> : ""}
    </div>
  );
};
export default SearchResult;
