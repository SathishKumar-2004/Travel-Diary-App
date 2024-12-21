import React from "react";
import "./UserItems.css";
import { Link, NavLink } from "react-router-dom";
import Card from "../../Shared/Components/UIElements/Card";
import Avatar from "../../Shared/Components/UIElements/Avatar";

const UserItems = ({ id, name, image, placeCount }) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${id}/places`}>
          <div className="user-item__image">
            <Avatar
              image={`${import.meta.env.VITE_ASSET_URL}${image}`}
              alt={name}
            />
          </div>
          <div className="user-item__info">
            <h2>{name}</h2>
            <h3>
              {placeCount} {placeCount === 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItems;
