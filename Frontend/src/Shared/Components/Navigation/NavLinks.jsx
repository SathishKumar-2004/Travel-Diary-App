import React, { useContext, useEffect, useRef, useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import "./NavLinks.css";
import { AuthContext } from "../../Context/Auth-context";

const NavLinks = () => {
  const auth = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileClickRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/"); // Navigate after logout
  };

  const handleProfileClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = () => {
    if (
      profileClickRef.current &&
      !profileClickRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">All Users</NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>My Places</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">Add Places</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Login / SignUp</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <div
          className="profileDiv"
          ref={profileClickRef}
          onClick={handleProfileClick}
        >
          <img
            src={`${auth.userImage}`}
            alt="profile image"
            className="profile-img"
          ></img>
          <div className={`dropdown ${isDropdownOpen ? "active" : ""}`}>
            <div className="dropdown-item">Profile Info</div>
            <div className="dropdown-item">Help & Support</div>
            <div
              className="dropdown-item"
              onClick={handleLogout}
              style={{
                color: "red",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              Logout
              <img
                src="/icons8-logout-16.png"
                alt="logout"
                style={{ marginLeft: "5px" }}
              />
            </div>
          </div>
        </div>
      )}
    </ul>
  );
};

export default NavLinks;
