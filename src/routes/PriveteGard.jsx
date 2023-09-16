import { Navigate, Outlet } from "react-router-dom";

const PrivetGard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user ? <Outlet /> : <Navigate to={"/login"} />;
};

export default PrivetGard;
