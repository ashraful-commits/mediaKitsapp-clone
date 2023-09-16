import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { RiEyeFill, RiEyeCloseFill } from "react-icons/ri";
import { showToast } from "../Utility/Toastify";

const Login = () => {
  // State to control password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // State to manage form input fields
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  // React Router's navigation hook
  const history = useNavigate();

  // Function to handle input field changes
  const handleInputChange = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Function to handle form submission
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      // Attempt to sign in with email and password using Firebase authentication
      await signInWithEmailAndPassword(auth, input.email, input.password).then(
        (userCredential) => {
          // Store user data in local storage
          localStorage.setItem("user", JSON.stringify(userCredential.user));
        }
      );

      // Redirect to the home page on successful login
      history("/");

      // Show a success toast notification
      showToast("success", "Login successfully done!");
    } catch (error) {
      // Show an error toast notification if login fails
      showToast("error", error.message);
    }
  };
  return (
    <div className="w-full flex justify-center items-center min-h-screen max-h-auto">
      <div className="row justify-center items-center flex w-full h-full">
        <div className="col justify-center items-center flex w-full h-full px-14">
          <div className="form  flex items-center justify-center w-full h-full">
            <form
              onSubmit={handleOnSubmit}
              action=""
              className=" flex  flex-col gap-5"
            >
              <img className="w-10 my-5" src="/public/asset 10.svg" alt="" />
              <h1 className="my-5 text-3xl">welcome back !</h1>
              <input
                name="email"
                value={input.email}
                onChange={handleInputChange}
                className="border-b border-black py-2 focus:outline-none bg-transparent"
                type="text"
                placeholder="email"
              />
              <div className="relative flex">
                <input
                  name="password"
                  value={input.password}
                  onChange={handleInputChange}
                  className="border-b border-black  w-full py-2 focus:outline-none bg-transparent"
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                />
                <button
                  type="button"
                  className="absolute top-5 right-0"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <RiEyeCloseFill /> : <RiEyeFill />}
                </button>
              </div>
              <button
                type="submit"
                className="bg-pink-600 py-2 rounded-full text-white font-bold"
              >
                Login
              </button>
              <p className="text-sm">
                don&apos;t have an account?{" "}
                <Link className="text-pink-500 font-bold" to="/register">
                  sign up
                </Link>
              </p>
              <p>
                forgot your password?{" "}
                <Link className="text-pink-500 font-bold">
                  reset my password
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
