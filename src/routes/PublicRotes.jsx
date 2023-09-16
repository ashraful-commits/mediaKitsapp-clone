import Login from "../pages/Login";
import Register from "../pages/Register";
import PublicGird from "./publicGird";

const PublicRotes = [
  {
    element: <PublicGird />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
];
export default PublicRotes;
