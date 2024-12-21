import React, { useState } from "react";
import "./MainNavigation.css";
import MainHeader from "./MainHeader";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavLinks from "./NavLinks";
import BackDrop from "../UIElements/Backdrop";
import SideDrawer from "./SideDrawer";

const MainNavigation = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      {isDrawerOpen && <BackDrop onClick={handleDrawerClose} />}

      <SideDrawer show={isDrawerOpen} onClick={handleDrawerClose}>
        <nav className="main-navigation__drawer-nav">
          <div className="close">
            <img
              style={{
                width: "7%",
                float: "right",
                "margin-top": "0.5rem",
                cursor: "pointer",
              }}
              src="/close1437.jpg"
              alt="Close"
            />
          </div>
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={handleDrawerOpen}
        >
          <img src="./burger.png" alt="" className="img" />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">
            <div className="nav-title">
              <div className="nav-logo">
                <img
                  src="/WanderLog Logo-2.png"
                  alt=""
                  style={{
                    width: "2rem",
                    marginRight: "1rem",
                  }}
                />
              </div>
              <div className="nav-brand kanit-font">WanderLog</div>
            </div>
          </Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
