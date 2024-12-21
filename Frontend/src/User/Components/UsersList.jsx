import React from "react";
import "./UsersList.css";
import UserItems from "./UserItems";

const UsersList = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="center">
        {" "}
        <h2>No Users Found.</h2>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {items.map((user) => (
        <UserItems
          key={user.id}
          id={user.id}
          name={user.name}
          image={user.image}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
