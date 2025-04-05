import { Navigate } from "react-router-dom";

export const ProtectedRouteForDashboard = ({ children, e }) => {
  const isAdminLogin = localStorage.getItem("isAdminLogin");
  if (!isAdminLogin) {
    return <Navigate to="/login" />;
  }

  return children; // Render the children if all conditions are met
};
