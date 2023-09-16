import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../src/config/firebase";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { showToast } from "../Utility/Toastify";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const [input, setInput] = useState({
    first_name: "",
    last_name: "",
    email: "",
    new_password: "",
    confirm_new_password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  //============================================onchange value
  const handleOnchange = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (input.new_password !== input.confirm_new_password) {
      showToast("error", "confirm password not match");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      const newDisplayName = input.first_name + " " + input.last_name;

      // Update email and password
      await updateEmail(currentUser, input.email);
      await updatePassword(currentUser, input.new_password);

      // Update display name in Firebase Authentication
      await updateProfile(currentUser, {
        displayName: newDisplayName,
      });
      console.log(auth.currentUser.uid);
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        phone: input.phone,
      })
        .then(() => {
          navigate("/login");
        })
        .catch((error) => {
          showToast("error", error.message);
        });

      showToast("success", "Profile updated");
    } catch (error) {
      setError("Error updating profile: " + error.message);
    }
  };
  //===================================get doc

  //==================================== useEffect
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.uid) {
      const docRef = doc(db, "users", user.uid);

      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists) {
            const loginUser = auth.currentUser;
            const userData = docSnap.data();

            if (loginUser && userData) {
              const { displayName, email } = loginUser;
              const disName = displayName.split(" ");
              const firstName = disName[0] || "";
              const lastName = disName.slice(1).join(" ") || "";

              setInput({
                first_name: firstName,
                last_name: lastName,
                email: email || "",
                phone: userData.phone || "",
              });
            } else {
              showToast("error", "User or data not available");
            }
          } else {
            showToast("error", "No such document");
          }
        })
        .catch((error) => {
          showToast("error", error.message);
        });
    } else {
      showToast("error", "User not found in localStorage");
    }
  }, []);

  return (
    <div className="container-fluid flex justify-center items-center w-full h-full">
      <div className="row flex justify-center items-center w-full h-full">
        <div className="col mt-20 md:px-10  px-5 w-full h-full lg:px-72">
          <form
            action="
          "
            onSubmit={handleUpdateProfile}
          >
            <div className="profile bg-white px-5 my-10 rounded-2xl shadow-sm">
              <div className="user  border-b-2 border-pink-600 pt-10 pb-5 flex justify-center items-center flex-col">
                <span className="text-3xl my-3 w-20 h-20 rounded-full bg-pink-600 flex justify-center text-white font-bold items-center">
                  MA
                </span>
                <h1 className="text-xl font-bold capitalize">
                  Md. ashraful alam
                </h1>
                <span>basic info</span>
              </div>
              <div className="border-b-[2px] my-10 py-5">
                <h4 className="font-bold">Name</h4>
                <div className="name flex gap-5 items-center">
                  <div className="my-4 flex-col gap-4 flex">
                    <label htmlFor="" className="text-xs">
                      first name*
                    </label>{" "}
                    <input
                      type="text"
                      name="first_name"
                      value={input.first_name}
                      onChange={handleOnchange}
                      className="text-xs border-b-[1px] py-2 focus:border-b-pink-600 focus:outline-none"
                      placeholder="first name"
                    />
                  </div>
                  <div className="my-4 flex-col gap-4 flex">
                    <label htmlFor="" className="text-xs">
                      last name*
                    </label>{" "}
                    <input
                      name="last_name"
                      value={input.last_name}
                      onChange={handleOnchange}
                      type="text"
                      className="text-xs border-b-[1px] py-2 focus:border-b-pink-600 focus:outline-none"
                      placeholder="last name"
                    />
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="border-b-[2px] my-10 py-10">
                <h4 className="font-bold">Login info</h4>
                <div className="loginInfo flex flex-col  gap-5">
                  <div className="my-4 flex flex-col">
                    <label htmlFor="" className="text-xs">
                      email
                    </label>{" "}
                    <input
                      type="email"
                      name="email"
                      value={input.email}
                      onChange={handleOnchange}
                      className="text-xs border-b-[1px] py-2 focus:border-b-pink-600 focus:outline-none"
                      placeholder="email"
                    />
                  </div>
                  <div className="flex justify-start gap-4">
                    <input
                      name="new_password"
                      value={input.new_password}
                      onChange={handleOnchange}
                      type={showPassword ? "text" : "password"} // Toggle input type
                      className="text-xs border-b-[1px] py-2 focus:border-b-pink-600 focus:outline-none"
                      placeholder="New Password"
                    />
                    <input
                      name="confirm_new_password"
                      value={input.confirm_new_password}
                      onChange={handleOnchange}
                      type={showPassword ? "text" : "password"} // Toggle input type
                      className="text-xs border-b-[1px] py-2 focus:border-b-pink-600 focus:outline-none"
                      placeholder="Confirm New Password"
                    />
                    <span
                      onClick={toggleShowPassword}
                      className="text-xs focus:outline-none"
                    >
                      {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </span>
                  </div>
                  <div>
                    <input
                      name="phone"
                      value={input.phone}
                      onChange={handleOnchange}
                      className="text-xs border-b-[1px] py-2 focus:border-b-pink-600 focus:outline-none"
                      type="text"
                      placeholder="phone number"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-full py-5">
                {error && <p className="py-4">{error}</p>}
                <button
                  type="submit"
                  className=" bg-pink-600 px-20 py-3 rounded-full text-lg font-bold text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
