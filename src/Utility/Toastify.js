import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (type = "info", message = "", options = {}) => {
  toast[type](message, {
    position: "bottom-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    ...options,
  });
};
