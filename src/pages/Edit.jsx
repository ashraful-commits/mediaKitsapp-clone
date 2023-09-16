import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import ReactPlayer from "react-player/lazy";

import {
  AiFillCamera,
  AiFillEye,
  AiFillSetting,
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlineLink,
  AiOutlineLogout,
  AiOutlineMinus,
  AiOutlineShareAlt,
  AiOutlineUser,
} from "react-icons/ai";
import { BsPlus, BsArrowBarLeft, BsArrowBarRight } from "react-icons/bs";
import logo from "../../public/asset 1.svg";
import { Link, useLocation } from "react-router-dom";

import { CgMenuRightAlt } from "react-icons/cg";

import { db } from "../config/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../config/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { showToast } from "../Utility/Toastify";
import Model from "../components/Model";

const Edit = () => {
  const [contact, setContact] = useState(false);
  const { id } = useParams();
  const [editMenu, setEditMenu] = useState(false);

  const [name, setName] = useState("");
  const [InputTag, setInputTag] = useState("");
  const [tags, setTags] = useState([]);
  const [about, setAbout] = useState("");
  const [edit, setEdit] = useState(false);
  const [bigMenu, setBigMenu] = useState(false);
  const [menu, setMenu] = useState(false);
  const [display, setDisplay] = useState(false);
  const [profile, setProfile] = useState(false);
  const [background, setBackground] = useState(false);
  const [video, setVideo] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [imagesUrl, setImagesUrl] = useState([]);
  const [url, setUrl] = useState("");
  const [images, setImages] = useState(false);
  const [none, setNone] = useState(false);
  const [scale, setScale] = useState(0);

  const [horizontal, setHorizontal] = useState(0);
  const [vertical, setVertical] = useState(0);

  //======================handlePhoto
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();
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
  //=============== upload video
  const hnadleVideo = (e) => {
    const storageRef = ref(storage, `video/${e.target.files[0].name}`);
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
          setVideoUrl(downloadURL);
        });
      }
    );
  };
  //=================================== handle multiple images
  async function uploadFiles(file) {
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      () => {
        // Handle state change events
      },
      (error) => {
        console.error(`Upload of ${file.name} failed: ${error}`);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          if (downloadURL) {
            console.log(downloadURL);
            setImagesUrl((prev) => [...prev, downloadURL]);
          } else {
            setImagesUrl([]);
          }
        } catch (error) {
          console.error(
            `Error getting download URL for ${file.name}: ${error}`
          );
        }
      }
    );
  }
  const handleMultipleImages = async (e) => {
    const AllImages = [...e.target.files];

    await AllImages.forEach((element) => {
      uploadFiles(element);
    });
  };
  //==================================
  //============================= tag
  const handleTagArray = (e) => {
    e.preventDefault();
    if (InputTag) {
      setTags((prev) => [...prev, InputTag]);
      setInputTag("");
    } else {
      showToast("error", "add tags");
    }
  };
  //============================= tag
  const handleTageDelete = (index) => {
    setTags([...tags.filter((item, Ind) => Ind !== index)]);
  };

  //====================================== handle submit
  const handleEditMediakits = async () => {
    try {
      const q = doc(db, "mediaKites", id);
      await updateDoc(q, {
        name,
        photo,
        about,
        tags: tags,
        url,
        imagesUrl: imagesUrl,
        videoUrl,
      });
      navigate(`/user/${id}`);
      showToast("success", "updated successfull");
    } catch (error) {
      showToast("error", error.message);
    }
  };
  const path = useLocation();
  useEffect(() => {
    onSnapshot(doc(db, "mediaKites", id), (doc) => {
      const data = doc.data();

      if (data && data.tags) {
        setTags([...data.tags]);
      }
      setName(data ? data.name : "");
      setAbout(data ? data.about : "");
      setPhoto(data ? data.photo : null);
      setUrl(data ? data.url : "");
      setVideoUrl(data ? data.videoUrl : "");
      setImagesUrl(data ? [...data.imagesUrl] : []);
    });
  }, [id]);
  return (
    <>
      <div className="container-fluid  w-full min-h-screen max-h-auto  flex  justify-center ">
        <form
          className="w-full min-h-screen max-h-auto  flex  justify-center "
          action=""
          onSubmit={handleEditMediakits}
        >
          <div className="w-full z-[99999999] fixed top-0 left-0 h-16 bg-[#0b0927]">
            <nav className="w-full h-full px-5 lg:px-60 flex items-center justify-between">
              <div
                className={`logo  w-[33%] h-full flex justify-start items-center `}
              >
                <div className={`flex justify-start items-center `}>
                  <img className="w-10" src={logo} alt="" />
                  <h1 className="text-2xl mx-2 text-white font-bold hidden md:block lg:block">
                    media<span className="text-pink-500">kits</span>
                  </h1>
                </div>
              </div>
              <div className="flex cursor-none w-[33%] h-full justify-center items-center">
                <div
                  className={`w-12 h-7 border-[3.5px] cursor-pointer flex ${
                    path.pathname === `/user/${id}`
                      ? "justify-end"
                      : "justify-start"
                  }  items-center border-pink-600 rounded-full transition-all duration-200 delay-200  cursor-pointer`}
                  onClick={() => setEdit(!edit)}
                >
                  {path.pathname === `/edit/${id}` ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleEditMediakits();
                      }}
                      type="submit"
                    >
                      <Link to={`/user/${id}`}>
                        <AiFillEye className="text-2xl  rounded-full text-white bg-pink-500" />
                      </Link>
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="profile h-full w-[33%] flex justify-end items-center">
                <div className=" max-sm:hidden md:block lg:block   bg-pink-600 rounded-full  flex justify-center items-center">
                  <div
                    onClick={() => setBigMenu(!bigMenu)}
                    className="w-12 h-12 font-extrabold flex justify-center items-center text-white"
                  >
                    MA
                  </div>
                  {bigMenu && (
                    <Model
                      styleS={
                        "w-[250px]  h-auto right-0 px-5 flex shadow-lg rounded-xl flex-col gap-5 py-5"
                      }
                    >
                      <div className="">
                        <h4 className="text-lg flex items-center gap-2">
                          <span className="w-10 h-10 flex justify-center items-center text-black p-3 uppercase bg-pink-600 rounded-full">
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
                          {localStorage.getItem("user").displayName}
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
                        <Link className="flex items-center gap-4" to={"/"}>
                          <AiOutlineLogout /> <span>log out</span>
                        </Link>
                      </div>
                    </Model>
                  )}
                </div>
                <div className="  md:hidden lg:hidden">
                  {menu && (
                    <Model styleS="w-full top-[50px] right-0 ">
                      <ul className=" flex flex-col w-full p-5">
                        <li className="w-full py-2">
                          <Link to="/profile">edit profile</Link>
                        </li>
                        <li className="w-full py-2">
                          <Link to="/">my mediakits</Link>
                        </li>
                        <li className="w-full py-2">
                          <span>log out</span>
                        </li>
                      </ul>
                    </Model>
                  )}
                  <div className="flex items-center gap-5">
                    <div className="flex items-center text-white gap-2 text-xs">
                      <AiOutlineShareAlt className="text-xl font-extrabold" />{" "}
                      share
                    </div>
                    <div onClick={() => setMenu(!menu)} className="text-white">
                      {menu ? (
                        <AiOutlineClose className="text-3xl" />
                      ) : (
                        <CgMenuRightAlt className="text-3xl" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          <div className="sidebar max-sm:hidden  bg-gradient-to-r from-[#111f3b] to-[#0b0927] flex z-[99999999] top-0 lef-0 ">
            <div className="menu w-[70px] z-[9999] bg-[#0b0927] flex items-center gap-10 flex-col py-20 h-full">
              <img className="w-8 shrink-0" src={logo} alt="" />
              <ul className="text-white w-full space-y-5">
                <li className=" py-2 flex justify-center">
                  <span className="relative cursor-pointer bg-gray-500 rounded-full p-1">
                    <AiOutlineUser className="text-4xl " />
                  </span>
                </li>
                <li className=" py-2 flex justify-center">
                  <span className="bg-gray-500 cursor-pointer rounded-full p-1">
                    <AiOutlineLink className="text-4xl " />
                  </span>
                </li>
              </ul>
            </div>
            <div
              className={`transition-all flex justify-center relative py-10 ml-[-20px] delay-100 duration-300 menu_item px-5 ${
                editMenu ? "w-[250px]" : "w-0"
              }`}
            >
              <div className="overflow-hidden ">
                <form
                  action=""
                  className="flex flex-col w-full h-full text-white"
                >
                  <div className="display_info w-[180px] flex flex-col  border-b-2 border-b-white">
                    <h1
                      onClick={() => setDisplay(!display)}
                      className="text-md w-full cursor-pointer capitalize flex items-center my-3 font-bold"
                    >
                      {display ? (
                        <AiOutlineMinus className="w-5" />
                      ) : (
                        <BsPlus className="w-5" />
                      )}
                      Display information
                    </h1>
                    {display && (
                      <div className="flex flex-col py-5">
                        <span className="text-[14px] font-bold uppercase">
                          PassCode
                        </span>
                        <label htmlFor="" className="text-[13px]">
                          enable passcode protection?
                        </label>
                        <div className="flex my-2 gap-3">
                          <div className="flex ">
                            <input name="protection" type="radio" />
                            <label htmlFor="">yes</label>
                          </div>
                          <div className="flex ">
                            <input type="radio" name="protection" id="" />
                            <label htmlFor="">no</label>
                          </div>
                        </div>
                        <input
                          className="w-[180px] bg-transparent border-b-gray-500 border-b-2 focus:border-b-pink-600 focus:outline-none"
                          type="password"
                        />
                        <div className="flex flex-col gap-4">
                          <label
                            htmlFor=""
                            className="text-[14px] my-3 font-bold"
                          >
                            URL Handle
                          </label>
                          <input
                            onChange={(e) => setUrl(e.target.value)}
                            type="text"
                            value={url}
                            className=" bg-transparent border-b-2 border-b-gray-500 focus:outline-none focus:border-b-pink-600"
                            placeholder="app.mediaKits.com/"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="profile w-[180px] gap-3 flex flex-col items-start justify-center border-b-2 border-b-white">
                    <h1
                      onClick={() => setProfile(!profile)}
                      className="text-md w-full capitalize cursor-pointer flex items-center my-3 font-bold"
                    >
                      {profile ? (
                        <AiOutlineMinus className="w-5" />
                      ) : (
                        <BsPlus className="w-5" />
                      )}
                      profile
                    </h1>
                    {profile && (
                      <div className="flex gap-3 relative flex-col justify-center">
                        <span
                          onClick={() => setPhoto(null)}
                          className=" cursor-pointer absolute top-0 right-4"
                        >
                          <AiOutlineClose />
                        </span>
                        {photo ? (
                          <img
                            className="w-full h-full"
                            src={photo}
                            alt="user"
                          />
                        ) : (
                          <label
                            htmlFor="replaceImg"
                            className="w-[160px] h-[200px] flex justify-center items-center text-white bg-gray-600"
                          >
                            <span className="text-white capitalize">
                              replace image
                            </span>
                          </label>
                        )}
                        <input
                          type="file"
                          onChange={handlePhoto}
                          className="hidden"
                          name=""
                          id="replaceImg"
                        />
                        <div className="scale  items-start  flex flex-col justify-start ">
                          <label
                            htmlFor=""
                            className="text-[14px] my-4 font-bold"
                          >
                            {" "}
                            scale
                          </label>
                          <input
                            type="range"
                            onChange={(e) => setScale(e.target.value)}
                            value={scale}
                            min={0}
                            max={100}
                            className="h-[2px] w-full "
                            name=""
                            id=""
                          />
                        </div>
                        <div className="postion  items-start  flex flex-col justify-start  ">
                          <label htmlFor="" className="text-[14px] font-bold">
                            Position
                          </label>
                          <span className="text-[13px] my-4">
                            vertcal orientation
                          </span>
                          <input
                            className="w-full h-[2px] "
                            onChange={(e) => setVertical(e.target.value)}
                            value={vertical}
                            type="range"
                            name=""
                            id=""
                            min={0}
                            max={100}
                          />
                        </div>
                        <div className="horizontal items-start my-4 flex flex-col justify-start ">
                          <label
                            htmlFor=""
                            className="font-bold text-[13px] my-4 block"
                          >
                            HORIZONTAL ORIENTATION
                          </label>

                          <input
                            className="h-[2px] w-full "
                            onChange={(e) => setHorizontal(e.target.value)}
                            value={horizontal}
                            min={0}
                            max={100}
                            type="range"
                            name=""
                            id=""
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="background w-[180px]  border-b-2 border-b-white">
                    <h1
                      onClick={() => setBackground(!background)}
                      className="text-md w-full capitalize cursor-pointer flex items-center my-3 font-bold"
                    >
                      {background ? (
                        <AiOutlineMinus className="w-5" />
                      ) : (
                        <BsPlus className="w-5" />
                      )}
                      Background
                    </h1>
                    {background && (
                      <div className="my-5">
                        <div className="buttons flex my-4 justify-center items-center  bg-gray-900">
                          <span
                            onClick={() => {
                              setVideo(!video), setImages(false);
                            }}
                            className={`text-sm cursor-pointer px-2 py-1 ${
                              video ? "bg-pink-600" : "bg-gray-800"
                            }`}
                          >
                            VIDEO
                          </span>
                          <span
                            onClick={() => {
                              setImages(!images), setVideo(false);
                            }}
                            className={`text-sm cursor-pointer  px-2 py-1 ${
                              images ? "bg-pink-600" : "bg-gray-800"
                            }`}
                          >
                            IMAGES
                          </span>
                          <span
                            onClick={() => {
                              setNone(!none),
                                setImages(false),
                                setVideo(false),
                                setImagesUrl([]),
                                setVideoUrl(null);
                            }}
                            className={`text-sm cursor-pointer  px-2 py-1 ${
                              none ? "bg-pink-600" : "bg-gray-800"
                            }`}
                          >
                            NONE
                          </span>
                        </div>
                        <div>
                          {video && (
                            <div className="video w-full h-[200px] flex justify-center items-center bg-gray-700 relative">
                              <span
                                onClick={() => setVideoUrl(null)}
                                className=" cursor-pointer absolute top-0 right-4"
                              >
                                <AiOutlineClose />
                              </span>

                              {videoUrl ? (
                                <video width="100%" height="100%" controls>
                                  <source src={videoUrl} />
                                </video>
                              ) : (
                                <label htmlFor="video">video</label>
                              )}
                              <input
                                type="file"
                                onChange={hnadleVideo}
                                className="hidden"
                                id="video"
                              />
                            </div>
                          )}
                          {images && (
                            <div
                              className={`images w-full min-h-[200px] ${
                                imagesUrl?.length > 0 ? "overflow-scroll" : ""
                              }
                               flex justify-center relative items-start bg-gray-700 flex-col gap-3`}
                            >
                              <span
                                onClick={() => setImagesUrl([])}
                                className=" cursor-pointer absolute top-0 right-4"
                              >
                                <AiOutlineClose />
                              </span>
                              {imagesUrl?.length > 0 ? (
                                <div className="flex flex-col justify-center">
                                  {imagesUrl?.map((item, index) => {
                                    return (
                                      <img
                                        className="w-full object-cover "
                                        key={index}
                                        src={item}
                                        alt="gallary"
                                      />
                                    );
                                  })}
                                </div>
                              ) : (
                                <label
                                  htmlFor="images"
                                  className="w-20 h-20 p-5 border border-dashed flex justify-center items-center"
                                >
                                  IMAGE
                                </label>
                              )}

                              <input
                                onChange={handleMultipleImages}
                                type="file"
                                className="hidden"
                                multiple
                                id="images"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>
              <div
                onClick={() => setEditMenu(!editMenu)}
                className="my-auto absolute top-[43%] right-0  cursor-pointer rounded-tr-xl rounded-br-xl text-white bg-[#3b4862] py-5 px-1"
              >
                {editMenu ? <BsArrowBarLeft /> : <BsArrowBarRight />}
              </div>
            </div>
          </div>

          <div className="wrapper overflow-y-scroll w-full min-h-screen max-h-auto flex-col flex  justify-center ">
            <div className="row flex-shrink-0 relative z-[7] justify-center items-center w-full h-full  bg-[#0b0927] py-10">
              <div className="absolute z-[9] w-[50%] -right-[0%] top-[41%] h-[300px] lg:h-[300px] rounded-full rounded-tr-none rounded-br-none bg-gradient-to-r from-[#0b0927] to-pink-900"></div>
              <div className="col flex-shrink-0 relative pt-32 flex-col z-[10] md:flex-row-reverse lg:flex-row-reverse gap-20 lg:px-36 md:px-0 px-5 w-full h-full flex justify-center items-center">
                {/* //========================= user image  */}
                <div className="w-full my-10 h-full  relative md:w-[40vw] lg:w-[30vw] flex justify-center items-center">
                  <img
                    className={` w-[200px] h-[200px] lg:w-[300px] md:w-[350px] md:h-[350px] absolute flex-shrink-0 lg:h-[300px] rounded-full object-cover scale-[${scale}] left-[${horizontal}%] top-[${vertical}%]`}
                    src={photo}
                    alt="user"
                  />
                  <label
                    className="absolute cursor-pointer z-[30] -bottom-[10px] md:top-0 md:right-0 lg:top-0 lg:right-0 right-[45%] bg-pink-500 w-[45px] h-[45px] flex justify-center items-center rounded-full"
                    htmlFor="profilePhoto"
                  >
                    <AiFillCamera className="text-xl text-white" />
                  </label>
                  <input
                    className="hidden flex-shrink-0"
                    onChange={handlePhoto}
                    type="file"
                    id="profilePhoto"
                  />
                </div>
                <div className="w-full flex flex-col items-center justify-center md:w-[50vw] lg:w-[60vw] gap-10  md:items-start lg:items-start">
                  <textarea
                    className=" w-full flex-shrink-0 min-h-20 text-6xl md:text-left  bg-transparent placeholder:text-capitalize text-white lg:text-left font-bold text-left border-b-2 border-b-gray-600 focus:border-b-pink-500 outline-none "
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                    id=""
                    value={name}
                    cols="30"
                    rows="3"
                  ></textarea>

                  <div className="flex gap-3 justify-center md:justify-start lg:justify-start ">
                    {tags?.map((item, index) => {
                      return (
                        <span
                          key={index}
                          className="bg-gray-500 flex-shrink-0 rounded-full px-2 py-1  flex items-center gap-2 bg-opacity-50 text-white"
                        >
                          {item}{" "}
                          <span onClick={() => handleTageDelete(index)}>
                            <AiOutlineClose />
                          </span>
                        </span>
                      );
                    })}
                  </div>
                  <div className=" w-full flex">
                    <input
                      name="tags"
                      value={InputTag}
                      onChange={(e) => setInputTag(e.target.value)}
                      className="flex-shrink-0 text-white border-gray-600 border-b-2 focus:border-b-pink-500 bg-transparent focus:outline-none"
                      type="text"
                    />
                    <span onClick={handleTagArray} className=" cursor-pointer">
                      <BsPlus className="text-white text-3xl" />
                    </span>
                  </div>
                  <div className="md:text-left lg:text-left">
                    <h4 className="text-white font-bold text-lg my-3">About</h4>
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      className=" border-b-2 border-b-gray-600  focus:border-b-pink-600 text-white bg-transparent w-full focus:outline-none "
                      cols={100}
                      rows={10}
                    ></textarea>
                  </div>

                  <span
                    onClick={() => setContact(!contact)}
                    className="text-2xl cursor-pointer flex-shrink-0 relative text-white bg-pink-600 px-24 py-8 rounded-full font-bold my-10"
                  >
                    contact me
                    <span className="absolute top-0 right-0 bg-pink-500 w-10 h-10 rounded-full flex justify-center items-center shadow-md">
                      <AiOutlineEdit />
                    </span>
                    {contact && (
                      <Model
                        styleS={
                          "w-auto px-5 py-5 h-auto rounded-lg bottom-[90px] right-0"
                        }
                      >
                        <form
                          action=""
                          className="text-gray-500  flex flex-col justify-center items-start gap-3 "
                        >
                          <label htmlFor="" className="text-gray-600 text-sm">
                            enable CTA(callto action) button?
                          </label>
                          <div className="w-full flex flex-col gap-5">
                            <div className="flex gap-2 items-center">
                              <input type="radio" name="" id="" />
                              <label
                                htmlFor=""
                                className="text-gray-500 text-xs"
                              >
                                yes
                              </label>
                            </div>
                            <div className="flex gap-2 items-center">
                              <input type="radio" name="" id="" />
                              <label
                                htmlFor=""
                                className="text-gray-500 text-xs"
                              >
                                no
                              </label>
                            </div>
                          </div>
                          <label htmlFor="" className="text-sm">
                            Button text
                          </label>
                          <input
                            className="focus:outline-none text-xs focus:border-b-2 focus:border-b-pink-500 border-b border-b-gray-500"
                            type="text"
                            value={"Contact Me"}
                          />
                          <label htmlFor="" className="text-sm">
                            destination type
                          </label>
                          <div className="flex gap-5">
                            <div className="flex gap-2 ">
                              <input type="radio" name="" id="" />
                              <label
                                htmlFor=""
                                className="text-gray-500 text-xs"
                              >
                                email
                              </label>
                            </div>
                            <div className="flex gap-2 items-center">
                              <input type="radio" name="" id="" />
                              <label
                                htmlFor=""
                                className="text-gray-500 text-xs"
                              >
                                website
                              </label>
                            </div>
                          </div>
                          <label htmlFor="" className="text-sm">
                            email
                          </label>
                          <input
                            type="text"
                            className="text-xs border-b border-b-gray-400 focus:outline-none focus:border-b-pink-500"
                            value={"Contact Me"}
                          />
                          <span className="uppercase text-white text-sm  py-2 rounded-full bg-pink-600 my-4 w-full">
                            continue
                          </span>
                        </form>
                      </Model>
                    )}
                  </span>
                </div>
              </div>
            </div>
            {/* //footer  */}
            <div className="row justify-center items-center w-full h-auto  bg-white ">
              <div className="col py-10 gap-20 lg:px-72 px-5 w-full flex justify-center items-center">
                <h5 className="flex justify-center items-center  gap-2">
                  data verified by{" "}
                  <img className="w-5 h-5" src="/public/asset 1.svg" alt="" />{" "}
                  <p>
                    media<span className="text-pink-600 ">kits</span>
                  </p>
                </h5>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Edit;
