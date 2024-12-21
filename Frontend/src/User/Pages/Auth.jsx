import React, { useContext, useState } from "react";
import "./Auth.css";
import Card from "../../Shared/Components/UIElements/Card";
import Input from "../../Shared/Components/FormElements/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../Shared/utils/Validators";
import { useForm } from "../../Shared/hooks/form-hook";
import Button from "../../Shared/Components/FormElements/Button";
import { AuthContext } from "../../Shared/Context/Auth-context";
import axios from "axios";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import ImageUpload from "../../Shared/Components/FormElements/ImageUpload";

const Auth = () => {
  const auth = useContext(AuthContext);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    if (isLoginMode) {
      try {
        let data = {
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/users/login`,
          data
        );
        console.log(response);
        const responseData = response.data;

        console.log(responseData);
        setIsLoading(false);
        auth.login(responseData.userId, responseData.token, responseData.image);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        setError(
          err.response?.data?.message ||
            "Something went Wrong, Please try again later"
        );
      }
    } else {
      try {
        let formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/users/signup`,
          formData
        );
        const responseData = response.data;

        console.log(responseData);
        setIsLoading(false);
        auth.login(responseData.userId, responseData.token, responseData.image);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        setError(
          err.response?.data?.message ||
            "Something went Wrong, Please try again later"
        );
      }
    }
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLoginMode ? "Login" : "SignUp"}</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload id="image" small onInput={inputHandler} />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
