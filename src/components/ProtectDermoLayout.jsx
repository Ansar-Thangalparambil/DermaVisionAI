import { Navigate } from "react-router-dom";

export const ProtectedRouteForDermoLayout = ({ children, e }) => {
  const user = localStorage.getItem("dermatologistToken");
  const userDetails = user ? JSON.parse(user) : null;
  if (!userDetails) {
    return <Navigate to="/dermoLogin" />;
  }

  return children; // Render the children if all conditions are met
};
