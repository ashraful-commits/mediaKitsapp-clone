import { useEffect, useRef, useState } from "react";
import { AiFillSetting, AiOutlineLogout, AiOutlineUser } from "react-icons/ai";

import { Link, useLocation, useNavigate } from "react-router-dom";
import Model from "./Model";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { showToast } from "../Utility/Toastify";
import logo from "../../public/asset 1.svg";

/**
 * Header component for the application.
 * This component displays the navigation bar and user profile information.
 */
const Header = () => {
  const [bigMenu, setBigMenu] = useState(false);

  const path = useLocation();
  const navigate = useNavigate();

  /**
   * Handles the user logout process.
   * Signs the user out and redirects to the login page.
   */
  const handleLogOut = async () => {
    await signOut(auth)
      .then(() => {
        showToast("success", "Log out");
        localStorage.removeItem("user");
        navigate("/login");
      })
      .catch((error) => {
        showToast("error", error.message);
      });
  };

  const menuRef = useRef();

  /**
   * Handles click events outside of the user profile menu.
   * Closes the menu if a click occurs outside of it.
   */
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setBigMenu(false);
    }
  };

  useEffect(() => {
    // Add a click event listener to the document
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      {(path.pathname === `/` ||
        path.pathname === `/create` ||
        path.pathname === `/profile`) && (
        <div className="w-full fixed z-[99999999] top-0 left-0 h-16 ">
          <nav className="w-full h-full px-10 flex items-center justify-between">
            <div className="logo w-[33%] h-full flex justify-start items-center ">
              <img className="w-10" src={logo} alt="" />
              <h1 className="text-2xl mx-2 font-bold hidden md:block lg:block">
                media<span className="text-pink-500">kits</span>
              </h1>
            </div>
            <div className="profile ">
              <div className="w-12 h-12  bg-pink-600 rounded-full overflow-hidden flex justify-center items-center">
                <span
                  onClick={() => setBigMenu(!bigMenu)}
                  className="font-extrabold cursor-pointer uppercase text-white"
                >
                  {
                    JSON.parse(localStorage.getItem("user"))
                      ?.displayName.split(" ")[0]
                      .split("")[0]
                  }
                  {
                    JSON.parse(localStorage.getItem("user"))
                      .displayName.split(" ")[1]
                      .split("")[0]
                  }
                </span>
              </div>
              {bigMenu && (
                <Model
                  styleS={
                    "w-[250px] z-[9999999999999999999999] h-auto right-14 top-18 px-5 flex shadow-lg rounded-xl flex-col gap-5 py-5"
                  }
                >
                  <div className="">
                    <h4 className="text-lg flex items-center gap-2">
                      <span className="w-10 h-10 flex justify-center items-center text-white p-3 uppercase bg-pink-600 rounded-full">
                        {
                          JSON.parse(localStorage.getItem("user"))
                            .displayName.split(" ")[0]
                            .split("")[0]
                        }
                        {
                          JSON.parse(localStorage.getItem("user"))
                            .displayName.split(" ")[1]
                            .split("")[0]
                        }
                      </span>{" "}
                      {JSON.parse(localStorage.getItem("user")).displayName}
                    </h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link to="/profile" className="flex items-center gap-4">
                      <AiFillSetting /> <span>edit profile</span>
                    </Link>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link to={"/"} className="flex items-center gap-4">
                      <AiOutlineUser /> <span>my mediakits</span>
                    </Link>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLogOut}
                      className="flex items-center gap-4"
                      to={"/"}
                    >
                      <AiOutlineLogout /> <span>log out</span>
                    </button>
                  </div>
                </Model>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
