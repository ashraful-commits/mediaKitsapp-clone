import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { db } from "../config/firebase";
import logo from "../../public/asset 1.svg";
import {
  AiFillEdit,
  AiFillSetting,
  AiOutlineArrowDown,
  AiOutlineClose,
  AiOutlineLogout,
  AiOutlineShareAlt,
  AiOutlineUser,
} from "react-icons/ai";
import { CgMenuRightAlt } from "react-icons/cg";
import Model from "../components/Model";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import MyPDFComponent from "../components/Pdf";

const User = () => {
  // Retrieve the user ID from the URL parameters
  const { id } = useParams();

  // State to toggle edit mode
  const [edit, setEdit] = useState(false);

  // State to manage the visibility of the big menu
  const [bigMenu, setBigMenu] = useState(false);

  // State to manage the visibility of the mobile menu
  const [menu, setMenu] = useState(false);

  // State to store media kit data
  const [mediaKit, setMediaKit] = useState({});

  useEffect(() => {
    // Subscribe to changes in the media kit document in Firestore
    const unsubscribe = onSnapshot(doc(db, "mediaKites", id), (doc) => {
      setMediaKit({ id: id, ...doc.data() });
    });

    // Unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [id]);

  // Get the current URL path
  const path = useLocation();

  // Reference for PDF generation
  const pdfRef = useRef();

  // Function to download a PDF version of the media kit
  const downloadPdf = () => {
    const input = pdfRef.current;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = 0;
      const imgY = 0;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      pdf.save("MediaKites.pdf");
    });
  };

  return (
    <>
      {/* //==================download  */}
      <div className="container-fluid overflow-hidden w-full min-h-screen max-h-auto flex-col flex  justify-center ">
        <div className="w-full z-[99999999] fixed top-0 left-0 h-16 bg-[#0b0927]">
          <nav className="w-full h-full px-5 lg:px-60 flex items-center justify-between">
            <div
              className={`logo  w-[33%] h-full flex justify-start items-center `}
            >
              <div className={`flex justify-start items-center `}>
                <img className="w-10" src="/public/asset 1.svg" alt="" />
                <h1 className="text-2xl mx-2 text-white font-bold hidden md:block lg:block">
                  media<span className="text-pink-500">kits</span>
                </h1>
              </div>
            </div>
            <div className="flex  w-[33%] h-full justify-center items-center">
              <div>
                <div
                  className={`w-12 h-7 border-[3.5px] flex ${
                    path.pathname === `/user/${id}`
                      ? "justify-end"
                      : "justify-start"
                  }  items-center border-pink-600 rounded-full transition-all duration-200 delay-200  cursor-pointer`}
                  onClick={() => setEdit(!edit)}
                >
                  {path.pathname === `/user/${id}` ? (
                    <Link to={`/edit/${id}`}>
                      <AiFillEdit className="text-2xl rounded-full text-white bg-pink-500" />
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="profile h-full w-[33%] flex justify-end items-center">
              <div className="flex items-center gap-5 mx-2">
                <div className="flex items-center text-b gap-2 text-white text-xs">
                  <button
                    onClick={downloadPdf}
                    className="flex items-center gap-2"
                  >
                    {" "}
                    <AiOutlineArrowDown className="text-lg text-white font-extrabold" />{" "}
                    <span className="hidden md:block lg:block">
                      download mediaKits
                    </span>
                  </button>
                </div>
              </div>
              <div className=" max-sm:hidden md:block lg:block   bg-pink-600 rounded-full  flex justify-center items-center">
                <button
                  onClick={() => setBigMenu(!bigMenu)}
                  className="w-12 h-12 font-extrabold flex justify-center items-center text-white"
                >
                  MA
                </button>
                {bigMenu && (
                  <Model
                    styleS={
                      "w-[250px]  h-auto lg:right-[14%] md:right-[8%] right-0 px-5 flex shadow-lg rounded-xl flex-col gap-5 py-5"
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
                        <button>log out</button>
                      </li>
                    </ul>
                  </Model>
                )}
                <div className="flex items-center gap-5">
                  <button className="flex items-center text-white gap-2 text-xs">
                    <AiOutlineShareAlt className="text-xl font-extrabold" />{" "}
                    share
                  </button>
                  <button onClick={() => setMenu(!menu)} className="text-white">
                    {menu ? (
                      <AiOutlineClose className="text-3xl" />
                    ) : (
                      <CgMenuRightAlt className="text-3xl" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div className="row  relative z-[5] justify-center items-center w-full h-full  bg-[#0b0927] py-10">
          <div className="absolute z-[9] w-[50%] rounded-tr-none rounded-br-none -right-[0%] top-[41%] h-[300px] lg:h-[300px] rounded-full bg-gradient-to-r from-[#0b0927] to-pink-900"></div>
          <div className="col relative pt-32 z-[10] flex-col md:flex-row-reverse lg:flex-row-reverse gap-20 lg:px-72 px-5 w-full h-full flex justify-center items-center">
            <div className="w-full h-full md:w-[30vw] lg:w-[30vw] flex justify-center items-center">
              <img
                className="w-72 h-72 rounded-full object-cover"
                src={mediaKit.photo}
                alt=""
              />
            </div>
            <div className="w-full flex flex-col items-center justify-center md:w-[60vw] lg:w-[60vw] gap-10 md:items-start lg:items-start">
              <h1 className="text-white text-6xl md:text-left lg:text-left font-bold text-center ">
                {mediaKit?.name}
              </h1>
              <div className="flex gap-3 justify-center md:justify-start lg:justify-start my-10">
                {mediaKit.tags?.map((item, index) => {
                  return (
                    <span
                      key={index}
                      className="bg-gray-500 rounded-full px-2 py-1  flex items-center gap-2 bg-opacity-50 text-white"
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
              <div className="md:text-left lg:text-left">
                <h4 className="text-white font-bold text-lg my-3">About</h4>
                <p className="text-white">{mediaKit.about}</p>
              </div>
              <button className="text-2xl text-white bg-pink-600 px-24 py-8 rounded-full font-bold my-10">
                contact me
              </button>
            </div>
          </div>
        </div>
        <div className="row justify-center items-center w-full h-auto  bg-white ">
          <div className="col py-10 gap-20 lg:px-72 px-5 w-full flex justify-center items-center">
            <h5 className="flex justify-center items-center  gap-2">
              data verified by <img className="w-5 h-5" src={logo} alt="" />{" "}
              <p>
                media<span className="text-pink-600 ">kits</span>
              </p>
            </h5>
          </div>
        </div>
      </div>
      <div className="fixed opacity-0 ">
        <div ref={pdfRef} className="w-[2480px] h-[3508px] ">
          <MyPDFComponent mediaKit={mediaKit} id={id} /> {/* A4 size */}
        </div>
      </div>
    </>
  );
};

export default User;
