import { Navigate, Outlet } from "react-router-dom";

const PublicGird = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user ? <Navigate to={"/"} /> : <Outlet />;
};

export default PublicGird;
