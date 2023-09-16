import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import { showToast } from "../Utility/Toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Register = () => {
  // State to manage form input fields
  const [input, setInput] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // State to control password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle password visibility
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // React Router's navigation hook
  const navigate = useNavigate();

  // Function to handle input field changes
  const handleOnchange = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Function to handle user registration
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Check if the password and confirm_password fields match
    if (input.password !== input.confirm_password) {
      showToast("error", "Passwords do not match!");
      return;
    }

    try {
      // Create a user with email and password using Firebase authentication
      const email = input.email;
      const password = input.password;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get the user object from the credential
      const user = userCredential.user;

      // Update the user's display name with first name and last name
      await updateProfile(user, {
        displayName: `${input.first_name} ${input.last_name}`,
      });

      // Show a success toast notification
      showToast("success", "User registered successfully");

      // Navigate to the login page
      navigate("/login");
    } catch (error) {
      // Show an error toast notification if registration fails
      showToast("error", error.message);
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen max-h-auto">
      <div className="row justify-center items-center flex w-full h-full">
        <div className="col justify-center items-center flex w-full h-full px-14">
          <div className="form  flex items-center justify-center w-full h-full">
            <form
              onSubmit={handleSignUp}
              action=""
              className=" flex flex-col gap-3"
            >
              <h1 className="my-5 text-3xl font-bold">welcome to mediakits</h1>
              <input
                onChange={handleOnchange}
                name="first_name"
                value={input.first_name}
                className="border-b border-black py-2 focus:border-b-2 transition-all duration-150  focus:border-pink-500 focus:outline-none bg-transparent"
                type="text"
                placeholder="first name *"
              />
              <input
                onChange={handleOnchange}
                name="last_name"
                value={input.last_name}
                className="border-b border-black py-2 focus:border-b-2 transition-all duration-150  focus:border-pink-500 focus:outline-none bg-transparent"
                type="text"
                placeholder="last name *"
              />
              <input
                onChange={handleOnchange}
                name="email"
                value={input.email}
                className="border-b border-black py-2 focus:border-b-2 transition-all duration-150  focus:border-pink-500 focus:outline-none bg-transparent"
                type="text"
                placeholder="email *"
              />
              <div className="flex w-full gap-3">
                <input
                  onChange={handleOnchange}
                  name="password"
                  value={input.password}
                  className="border-b w-full border-black py-2 focus:border-b-2 transition-all duration-150  focus:border-pink-500 focus:outline-none bg-transparent"
                  type={showPassword ? "text" : "password"}
                  placeholder="password *"
                />
                <input
                  onChange={handleOnchange}
                  name="confirm_password"
                  value={input.confirm_password}
                  className="border-b w-full border-black py-2 focus:border-b-2 transition-all duration-150  focus:border-pink-500 focus:outline-none bg-transparent"
                  type={showPassword ? "text" : "password"}
                  placeholder="confirm password *"
                />
                <button type="button" onClick={toggleShowPassword}>
                  {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}{" "}
                </button>
              </div>

              <button
                type="submit"
                className="bg-pink-600 py-2 mt-10 rounded-full text-white font-bold"
              >
                GET STARTED
              </button>
              <p className="text-sm">
                already signed up? {"  "}
                <Link className="text-pink-500 font-bold" to="/login">
                  Login
                </Link>
              </p>
              <p>
                *by signing up, you agree to our {"  "}
                <Link className="text-pink-500 font-bold">
                  terms and conditions
                </Link>
                {"  "}
                and {"  "}
                <Link className="text-pink-500 font-bold">privacy policy</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
