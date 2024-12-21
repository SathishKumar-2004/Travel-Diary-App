import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PlaceForm.css";

import Input from "../../Shared/Components/FormElements/Input";
import Button from "../../Shared/Components/FormElements/Button";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../Shared/utils/Validators";
import { useForm } from "../../Shared/hooks/form-hook";
import Card from "../../Shared/Components/UIElements/Card";
import { useHttpClient } from "../../Shared/hooks/http-hook";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import { AuthContext } from "../../Shared/Context/Auth-context";

const UpdatePlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState(null);
  const placeId = useParams().placeId;

  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/places/${placeId}`
        );
        setLoadedPlace(res.place);
        setFormData(
          {
            title: {
              value: res.place.title,
              isValid: true,
            },
            description: {
              value: res.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const data = {
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
      };
      const res = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        data,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      const id = auth.userId;
      navigate(`/${id}/places`);
    } catch (error) {}
    console.log("Form data submitted:", formState.inputs, auth.token);
  };

  return (
    <>
      {/* Error Modal */}
      <ErrorModal error={error} onClear={clearError} />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}

      {/* Fallback for No Place */}
      {!isLoading && loadedPlace === null && (
        <div className="center">
          <Card>
            <h2>Could not find place!</h2>
          </Card>
        </div>
      )}

      {/* Form for Updating Place */}
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={formSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            value={formState.inputs.title.value}
            valid={formState.inputs.title.isValid}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            value={formState.inputs.description.value}
            valid={formState.inputs.description.isValid}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
