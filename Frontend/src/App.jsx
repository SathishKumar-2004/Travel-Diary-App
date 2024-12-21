import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import MainNavigation from "./Shared/Components/Navigation/MainNavigation";
import { AuthContext } from "./Shared/Context/Auth-context";
import { useAuth } from "./Shared/hooks/auth-hook";
import LoadingSpinner from "./Shared/Components/UIElements/LoadingSpinner";

const Users = React.lazy(() => import("./User/Pages/Users"));
const NewPlace = React.lazy(() => import("./Places/Pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./Places/Pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./Places/Pages/UpdatePlace"));
const Auth = React.lazy(() => import("./User/Pages/Auth"));

const App = () => {
  const { token, login, logout, userId, userImage } = useAuth();

  const routes = token ? (
    <Routes>
      <Route path="/" element={<Users />} />
      <Route path="/:uid/places" element={<UserPlaces />} />
      <Route path="/places/new" element={<NewPlace />} />
      <Route path="/places/:placeId" element={<UpdatePlace />} />
      {/* Redirect all unmatched routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/" element={<Users />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/:uid/places" element={<UserPlaces />} />
      {/* Redirect all unmatched routes to login */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );

  return (
    <Router>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          login: login,
          logout: logout,
          userId: userId,
          userImage: userImage,
        }}
      >
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </AuthContext.Provider>
    </Router>
  );
};

export default App;
