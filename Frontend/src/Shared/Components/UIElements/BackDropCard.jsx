import React from "react";
import "./BackDropCard.css";
import ReactDOM from "react-dom";

const BackDropCard = (props) => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById("backdrop-hook")
  );
};

export default BackDropCard;
