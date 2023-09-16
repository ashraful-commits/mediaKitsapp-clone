import { createBrowserRouter } from "react-router-dom";
import PublicRotes from "./PublicRotes";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([...PublicRotes, ...PrivateRoute]);

export default router;
