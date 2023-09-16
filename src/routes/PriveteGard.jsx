import { Navigate, Outlet } from "react-router-dom";

const PriveteGard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user ? <Outlet /> : <Navigate to={"/login"} />;
};

export default PriveteGard;
