import React, { useContext, useEffect, useState } from "react";
import UsersList from "../Components/UsersList";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import { useHttpClient } from "../../Shared/hooks/http-hook";
import { AuthContext } from "../../Shared/Context/Auth-context";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [users, setUsers] = useState([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/users/`
        );
        setUsers(res.users);
      } catch (err) {}
    };

    fetchUsers(sendRequest);
  }, []);

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <UsersList items={users.filter((u) => u.id !== auth.userId)} />
    </>
  );
};

export default Users;
