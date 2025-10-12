/* eslint-disable react/prop-types */
import {Navigate} from "react-router-dom";

const RequireAuth = ({children}) => {
  const loggedIn = localStorage.getItem("loggenIn");

  if (!loggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default RequireAuth;
