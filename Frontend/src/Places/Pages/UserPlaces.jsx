import React, { useEffect, useState } from "react";
import PlaceList from "../Components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../Shared/hooks/http-hook";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const [fetchedPlaces, setFetchedPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().uid;

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const res = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/places/user/${userId}`
        );
        setFetchedPlaces(res.places);
      } catch (err) {}
    };

    getPlaces();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (deletedPlaceId) => {
    setFetchedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && fetchedPlaces && (
        <PlaceList items={fetchedPlaces} onDeletePlace={placeDeleteHandler} />
      )}
    </>
  );
};

export default UserPlaces;
