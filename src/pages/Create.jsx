import { useState } from "react";
import { AiOutlineClose, AiOutlineEdit, AiOutlineUser } from "react-icons/ai";
import { BsPlus } from "react-icons/bs";
import { showToast } from "../Utility/Toastify";
import { addDoc, collection } from "firebase/firestore";
import { auth, db, storage } from "../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import instagram from "../../public/instagram-circle.91084741.svg";
import tiktok from "../../public/tiktok-black.04bf356b.svg";
import twitter from "../../public/twitter-service-icon.5c4d8568.svg";
import youtube from "../../public/youtube-service-icon.c2d0029e.svg";
import facebook from "../../public/facebook-service-icon.f38a2125.svg";
/**
 * Create is a React component for creating media kits.
 * It allows users to input information, upload a photo, and connect social accounts.
 */
const Create = () => {
  // State for the current step in the creation process
  const [number, setNumber] = useState(0);

  // Function to increment the step number
  const handleIncNumber = () => {
    setNumber(number + 1);
    if (number > 2) {
      setNumber(0);
    }
  };

  // Function to decrement the step number
  const handleDecNumber = () => {
    setNumber(number - 1);
    if (number > 2) {
      setNumber(0);
    }
  };

  // State and functions for handling tags
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleTag = (e) => {
    e.preventDefault();
    if (tagInput) {
      setTags((prev) => [...prev, tagInput]);
      setTagInput("");
    }
  };

  const handleDeleteTag = (index) => {
    setTags([...tags.filter((item, ind) => ind !== index)]);
  };

  // State and function for handling photo upload
  const [photo, setPhoto] = useState(null);

  const handlePhoto = (e) => {
    const storageRef = ref(storage, `images/${e.target.files[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        showToast("error", error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPhoto(downloadURL);
        });
      }
    );
  };

  // State and functions for handling other form fields
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [about, setAbout] = useState("");

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleUrl = (e) => {
    setUrl(e.target.value);
  };

  const handleAbout = (e) => {
    setAbout(e.target.value);
  };

  // Navigation function for form submission
  const navigate = useNavigate();

  const handFormSubmit = async (e) => {
    e.preventDefault();
    console.log(url, photo, name, about, tags);
    try {
      await addDoc(collection(db, "mediaKites"), {
        uid: auth.currentUser.uid,
        name,
        photo,
        about,
        url,
        tags,
      });
      showToast("success", "Media kit created!");
      navigate("/");
    } catch (error) {
      showToast("error", error.message);
    }
  };

  return (
    <div className="container-fluid flex justify-center items-center w-full h-full">
      <div className="row flex justify-center items-center w-full h-full">
        <form
          action=""
          onSubmit={handFormSubmit}
          className="justify-center items-center w-full h-full"
        >
          {number === 0 && (
            <div className="col mt-20 md:px-10 px-5 w-full h-full lg:px-72">
              <h1 className="my-10 text-xl font-semibold">Create mediakit</h1>
              <div className="bg-white px-10 py-10 flex flex-col justify-center ">
                <div className="button_group flex justify-center py-5 border-b-2">
                  <div className="flex flex-col justify-between items-center  gap-2">
                    <span
                      className={`p-3 ${
                        number === 0 ? "bg-pink-600" : "bg-gray-600"
                      } rounded-full w-10 h-10 flex justify-center items-center text-white`}
                    >
                      1
                    </span>{" "}
                    <span className="text-center">display information</span>
                  </div>
                  <span className="w-20 md:w-32 lg:w-52 bg-gray-600 h-[1px] mt-5"></span>
                  <div className="flex flex-col justify-between items-center  gap-2">
                    <span
                      className={`p-3 ${
                        number === 1 ? "bg-pink-600" : "bg-gray-600"
                      } rounded-full w-10 h-10 flex justify-center items-center text-white`}
                    >
                      2
                    </span>{" "}
                    <span className="text-center">connect socials</span>
                  </div>
                  <span className="w-20 md:w-32 lg:w-52 bg-gray-600 h-[1px] mt-5"></span>
                  <div className="flex flex-col justify-between items-center  gap-2">
                    <span
                      className={`p-3 ${
                        number === 2 ? "bg-pink-600" : "bg-gray-600"
                      } rounded-full w-10 h-10 flex justify-center items-center text-white`}
                    >
                      3
                    </span>{" "}
                    <span className="text-center">finalize</span>
                  </div>
                </div>
                <div className="w-full h-full">
                  <div className="upload w-full flex py-10 justify-center items-center flex-col">
                    <h1 className="my-5 text-3xl font-semibold capitalize">
                      upload your headshot
                    </h1>
                    <span className="w-32 relative h-32 bg-gray-300 flex justify-center items-center rounded-xl">
                      {photo ? (
                        <img src={photo} alt="Uploaded" />
                      ) : (
                        <AiOutlineUser className="text-6xl" />
                      )}

                      <label
                        htmlFor="files"
                        className="absolute -bottom-[10%] w-8 h-8 rounded-full bg-pink-600 flex cursor-pointer justify-center items-center text-white font-bold  "
                      >
                        <AiOutlineEdit />
                      </label>
                      <input
                        type="file"
                        onChange={handlePhoto}
                        className="hidden"
                        id="files"
                      />
                    </span>
                    <h4 className="text-2xl   font-semibold my-10 capitalize">
                      url handle
                    </h4>
                    <div className="flex w-full flex-col items-center">
                      <label
                        htmlFor=""
                        className="w-full text-center self-start  my-3 "
                      >
                        url handle*
                      </label>
                      <input
                        type="text"
                        name="url"
                        value={url}
                        onChange={handleUrl}
                        placeholder="app.mediakits.com/"
                        className="  focus:outline-none  w-[100%] md:w-[60%] lg:w-[50%] border-b-[2px] border-b-gary-900 focus:border-b-pink-600 transition-all duration-400 delay-100"
                      />
                    </div>
                  </div>
                  <div className="displayName my-10 flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-semibold text-center capitalize my-10">
                      Display name
                    </h1>

                    <input
                      name="name"
                      value={name}
                      onChange={handleName}
                      className="focus:outline-none  w-[100%] md:w-[60%] lg:w-[50%] border-b-[2px] border-b-gary-900 focus:border-b-pink-600 transition-all duration-400 delay-100"
                      type="text"
                      placeholder="display name *"
                    />
                  </div>
                  <div className="typeYourBio my-10 flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-semibold text-center capitalize my-10">
                      type your bio
                    </h1>
                    <label htmlFor="">about*</label>
                    <textarea
                      cols={30}
                      name="about"
                      value={about}
                      onChange={handleAbout}
                      className="border  w-[100%] focus:outline-none focus:border-pink-600 md:w-[60%] bg-gray-200 lg:w-[50%]"
                      rows={8}
                    ></textarea>
                  </div>
                  <div className="tags my-10 flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-semibold text-center capitalize my-10">
                      tags
                    </h1>
                    <div className="flex gap-2 flex-wrap">
                      {tags?.map((item, index) => {
                        return (
                          <span
                            key={index}
                            className="flex items-center gap-2 bg-gray-200 px-2 rounded-full"
                          >
                            {item}{" "}
                            <button
                              className="cursor-pointer"
                              onClick={() => handleDeleteTag(index)}
                            >
                              <AiOutlineClose />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                    <div className="relative w-full flex justify-center items-center my-5">
                      <input
                        type="text"
                        onChange={(e) => setTagInput(e.target.value)}
                        value={tagInput}
                        className="focus:outline-none border-b-[2px]  w-[100%] md:w-[60%] lg:w-[50%]"
                        placeholder="tags"
                      />
                      <button className="right-2" onClick={handleTag}>
                        <BsPlus className="text-2xl" />
                      </button>
                    </div>
                  </div>
                  <div className="text-center w-full">
                    <button
                      onClick={handleIncNumber}
                      className="bg-pink-600 px-20 rounded-full text-lg font-bold text-white py-3"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {number === 1 && (
            <div className="col mt-20 md:px-10 px-5 w-full h-full lg:px-72">
              <h1 className="my-10 text-xl font-semibold">Create mediakit</h1>

              <div className="bg-white rounded-2xl px-10 py-10 text-center">
                <div className="button_group flex justify-center py-5 border-b-2">
                  <div className="flex flex-col justify-between items-center  gap-2">
                    <span
                      className={`p-3 ${
                        number === 0 ? "bg-pink-600" : "bg-gray-600"
                      } rounded-full w-10 h-10 flex justify-center items-center text-white`}
                    >
                      1
                    </span>{" "}
                    <span className="text-center">display information</span>
                  </div>
                  <span className="w-20 md:w-32 lg:w-52 bg-gray-600 h-[1px] mt-5"></span>
                  <div className="flex flex-col justify-between items-center  gap-2">
                    <span
                      className={`p-3 ${
                        number === 1 ? "bg-pink-600" : "bg-gray-600"
                      } rounded-full w-10 h-10 flex justify-center items-center text-white`}
                    >
                      2
                    </span>{" "}
                    <span className="text-center">connect socials</span>
                  </div>
                  <span className="w-20 md:w-32 lg:w-52 bg-gray-600 h-[1px] mt-5"></span>
                  <div className="flex flex-col justify-between items-center  gap-2">
                    <span
                      className={`p-3 ${
                        number === 2 ? "bg-pink-600" : "bg-gray-600"
                      } rounded-full w-10 h-10 flex justify-center items-center text-white`}
                    >
                      3
                    </span>{" "}
                    <span className="text-center">finalize</span>
                  </div>
                </div>
                <h1 className="my-10 text-4xl font-semibold">
                  connect your social accounts
                </h1>

                <p className="my-10">
                  choose the accounts you want to add to your mediakit
                </p>
                <p className="my-10">connect a new account</p>
                <div className="social my-20 flex gap-10 lg:px-52 flex-wrap justify-center">
                  <span className="p-10 overflow-hidden border rounded-2xl ">
                    <img
                      className=" w-14 h-14 object-cover"
                      src={facebook}
                      alt=""
                    />
                  </span>
                  <span className="p-10 overflow-hidden border rounded-2xl ">
                    <img
                      className=" w-14 h-14 object-cover"
                      src={instagram}
                      alt=""
                    />
                  </span>
                  <span className="p-10 overflow-hidden border rounded-2xl ">
                    <img
                      className=" w-14 h-14 object-cover"
                      src={tiktok}
                      alt=""
                    />
                  </span>
                  <span className="p-10 overflow-hidden border rounded-2xl ">
                    <img
                      className=" w-14 h-14 object-cover"
                      src={twitter}
                      alt=""
                    />
                  </span>
                  <span className="p-10 overflow-hidden border rounded-2xl ">
                    <img
                      className=" w-14 h-14 object-cover"
                      src={youtube}
                      alt=""
                    />
                  </span>
                </div>
                <div className="text-center w-full flex justify-center gap-3">
                  <button
                    onClick={handleDecNumber}
                    className="border-2 px-10  md:px-10 lg:px-20 rounded-full text-lg font-bold text-black py-1  md:py-3 lg:py-3"
                  >
                    go back
                  </button>
                  <button
                    type="submit"
                    className="bg-pink-600 px-10 md:px-10 lg:px-20 rounded-full text-lg font-bold text-white py-1 md:py-3 lg:py-3"
                  >
                    do this later
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Create;
