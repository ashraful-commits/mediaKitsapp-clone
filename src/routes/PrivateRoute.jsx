import Layouts from "../components/Layouts";
import Home from "../pages/Home";
import Create from "../pages/Create";
import User from "../pages/User";
import Edit from "../pages/Edit";
import Profile from "../pages/Profile";
import PriveteGard from "./PriveteGard";

const PrivateRoute = [
  {
    element: <PriveteGard />,
    children: [
      {
        element: <Layouts />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/create",
            element: <Create />,
          },
          {
            path: "/user/:id",
            element: <User />,
          },
          {
            path: "/edit/:id",
            element: <Edit />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
];
export default PrivateRoute;
