import { Navigate } from "react-router-dom";

export const ProtectedRouteForUserLayout = ({ children, e }) => {
  const user = localStorage.getItem("userInfo");
  const userDetails = user ? JSON.parse(user) : null;
  if (!userDetails) {
    return <Navigate to="/login" />;
  }

  return children; // Render the children if all conditions are met
};
