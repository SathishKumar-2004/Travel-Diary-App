import React, { useEffect, useReducer } from "react";

import "./Input.css";
import { validate } from "../../utils/Validators";

const inputReducer = (state, action) => {
  const { type, val } = action;
  switch (type) {
    case "CHANGE":
      return {
        ...state,
        value: val,
        isTouched: true,
        isValid: validate(val, action.validators),
      };
    case "Touch":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.value || "",
    isTouched: false,
    isValid: props.valid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid]);

  const onChangeHandler = (e) => {
    dispatch({
      type: "CHANGE",
      val: e.target.value,
      validators: props.validators,
    });
  };

  const onTouchHandler = () => {
    dispatch({
      type: "Touch",
    });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={onChangeHandler}
        onBlur={onTouchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        placeholder={props.placeholder}
        rows={props.rows || 3}
        onChange={onChangeHandler}
        onBlur={onTouchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control  ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
