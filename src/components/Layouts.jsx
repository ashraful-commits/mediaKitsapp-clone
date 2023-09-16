import { Outlet } from "react-router-dom";
import Header from "./Header";
import Model from "./Model";
import { BiHelpCircle, BiSolidMessageAlt } from "react-icons/bi";

import { useEffect, useRef, useState } from "react";

import {
  AiFillHome,
  AiFillMessage,
  AiOutlineSearch,
  AiOutlineSend,
} from "react-icons/ai";
import { FaAngleDown, FaAngleLeft, FaIntercom } from "react-icons/fa";
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { showToast } from "../Utility/Toastify";

/**
 * Layouts component serving as the main layout of the application.
 * It includes a header, chat functionality, and different views (Outlets) based on routes.
 */
const Layouts = () => {
  // State variables for controlling chat and message input
  const [chat, setChat] = useState(false);
  const [home, setHome] = useState(true);
  const [msg, setMsg] = useState(false);
  const [messageInput, setMessageInput] = useState(false);
  const [help, setHelp] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // Function to handle chat toggle
  const handleChat = (e) => {
    e.stopPropagation(); // Stop event propagation to prevent closing the modal
    if (!chat) {
      setChat(true);
    } else {
      setChat(false);
    }
  };

  // Reference for scrolling to the bottom of the chat messages
  const scrollRef = useRef();

  // Function to scroll to the bottom of the chat messages
  const scrollTobottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  console.log(auth.currentUser?.uid);
  useEffect(() => {
    scrollTobottom();
  }, [messages]);

  // Function to handle message submission
  const HandleOnsubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") {
      showToast("warning", "Please type a message");
    }
    try {
      const { uid, displayName } = auth.currentUser;
      await addDoc(collection(db, "messages"), {
        chatId: uid + "1ZhcVjEY2aSjVBgg9ykop7hhI0t2",
        id: uid,
        message: input,
        name: displayName || "",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      showToast("error", error.message);
    }
  };

  // Effect to listen for incoming messages
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt"),
      limit(50)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allMessages = [];
      querySnapshot.forEach((doc) => {
        allMessages.push({ ...doc.data() });
      });
      setMessages([
        ...allMessages.filter(
          (item) =>
            item.chatId ===
              auth.currentUser?.uid + "1ZhcVjEY2aSjVBgg9ykop7hhI0t2" ||
            item.chatId ===
              "1ZhcVjEY2aSjVBgg9ykop7hhI0t2" + auth.currentUser?.uid
        ),
      ]);
    });
    return () => unsubscribe;
  }, []);

  return (
    <div className="w-full bg-gray-100 min-h-screen h-auto">
      <Header />
      <Outlet />
      {chat && (
        <Model
          styleS={`w-[400px] bottom-16 shadow-lg z-[99999999999] right-10 rounded-lg overflow-hidden h-[700px]`}
        >
          <form onSubmit={HandleOnsubmit} action="">
            <div className="chatContainer w-full h-full bg-gradient-to-b from-purple-950 to-white flex flex-col items-center p-3">
              {/* Chat Home View */}
              {home && (
                <div className="row flex flex-col justify-center w-full">
                  {/* Chat Header */}
                  <div className="col w-full flex justify-between">
                    <img className="w-10 " src="/public/asset 1.svg" alt="" />
                    <div className="flex gap-3">
                      <img className="w-10 " src="/public/asset 1.svg" alt="" />
                      <img className="w-10 " src="/public/asset 1.svg" alt="" />
                      <img className="w-10 " src="/public/asset 1.svg" alt="" />
                    </div>
                  </div>
                  {/* Chat Intro */}
                  <div className="col mt-20 text-left">
                    <h1 className="text-3xl font-extrabold text-white">
                      <span className="text-purple-200"> Hi there</span> <br />{" "}
                      How can we help?
                    </h1>
                  </div>
                  {/* Chat Options */}
                  <div className="col  my-10 py-3 relative bg-white rounded-xl justify-between flex items-center px-5 w-full">
                    <div
                      onClick={() => {
                        setMsg(true), setHome(false), setHelp(false);
                      }}
                      className="text-left mx-10"
                    >
                      <p className="font-bold">Send us a message</p>
                      <span className="text-sm">
                        We'll be back online later today
                      </span>
                    </div>
                    <span>
                      <AiOutlineSend />
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      setHelp(true),
                        setMsg(false),
                        setHome(false),
                        setMessageInput(false),
                        setMsg(false);
                    }}
                    className="col   my- py-5 relative bg-white rounded-xl justify-between flex items-center px-5 w-full"
                  >
                    <span className="text-sm">
                      We'll be back online later today
                    </span>
                    <span>
                      <AiOutlineSearch />
                    </span>
                  </div>
                </div>
              )}

              {/* Chat Messages View */}
              {msg &&
                (!messageInput ? (
                  <div className="row w-full flex  flex-col justify-between items-center  h-full msg">
                    <div className="w-full text-center ">
                      <h1 className="text-xl my-2 font-bold text-white">
                        Messages
                      </h1>
                    </div>
                    <div className="messageList bg-gradient-to-b from-white w-full h-[500px] flex justify-center flex-col  items-center">
                      <AiFillMessage />
                      <p>No Messages</p>
                      <p>Messages from the team will be shown here</p>
                    </div>
                    <span
                      onClick={() => setMessageInput(true)}
                      className="flex px-4 py-1 text-white font-bold rounded-full items-center gap-3 bg-pink-600"
                    >
                      Send us a message <AiOutlineSend />
                    </span>
                  </div>
                ) : (
                  <div className="row w-full flex  flex-col justify-between items-center  h-full msg">
                    <div className="w-full text-center my-2">
                      <h1 className="text-xl font-bold text-white">
                        MediaKits
                      </h1>
                      <div className="flex justify-center -gap-5 items-center my-10">
                        {messages.map((item, index) => {
                          return (
                            <span
                              className="w-10 h-10 rounded-full border flex justify-center items-center text-purple-600 bg-white"
                              key={index}
                            >
                              {item.name.split("")[0]}
                            </span>
                          );
                        })}
                      </div>
                      <div>
                        <h1 className="text-lg font-bold text-white my-1">
                          We'll be back online later today
                        </h1>
                        <h1 className=" my-2 text-white text-xs ">
                          Ask us anything, or share your feedback.
                        </h1>
                      </div>
                      {messageInput && (
                        <span
                          onClick={() => setMessageInput(false)}
                          className="absolute top-5 left-4 text-white "
                        >
                          <FaAngleLeft />
                        </span>
                      )}
                    </div>
                    <div className="messageList bg-white overflow-y-scroll w-full h-[400px] flex justify-center flex-col  items-center">
                      <ul className={`flex flex-col gap-3  w-full `}>
                        {messages.map((msg, index) => (
                          <li
                            key={index}
                            className={`flex  items-end gap-3 mx-5 ${
                              auth.currentUser.uid === msg.id
                                ? "flex-row-reverse"
                                : ""
                            }`}
                          >
                            <div className="border w-8 h-8 rounded-full flex justify-center items-center text-white uppercase bg-purple-500 p-[5px] overflow-hidden">
                              <p className="text">
                                {msg.name.split(" ")[0].split("")[0]}
                                {msg.name.split(" ")[1].split("")[0]}
                              </p>
                            </div>
                            <span
                              className={` px-5 py-2 rounded-full ${
                                auth.currentUser.uid === msg.id
                                  ? "text-gray-600 rounded-br-none bg-pink-200"
                                  : "text-black rounded-bl-none bg-purple-200"
                              } `}
                            >
                              {msg.message}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div ref={scrollRef}></div>
                    </div>
                    <div className="inputfield bg-white flex px-5 w-full border-t border-t-gray-300">
                      <input
                        type="text"
                        name=""
                        id=""
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full focus:outline-none my-2"
                        placeholder="Send a message"
                      />
                      <button>
                        <AiOutlineSend />
                      </button>
                    </div>
                  </div>
                ))}
              {/* Help View */}
              {help && (
                <div className="row w-full flex  flex-col justify-between items-center  h-full msg">
                  <div className="w-full text-center ">
                    <h1 className="text-xl font-bold text-white">Help</h1>
                  </div>
                  <div className="w-full bg-white flex items-center justify-between px-5 my-4 py-2 rounded-full">
                    <input
                      type="search"
                      className="w-full h-full focus:outline-none "
                      placeholder="Search for help"
                    />{" "}
                    <button>
                      <AiOutlineSearch />
                    </button>
                  </div>
                  <div className="messageList bg-white overflow-y-scroll w-full h-[450px] flex justify-center flex-col  items-center">
                    <BiHelpCircle />
                    <p>No articles yet</p>
                  </div>
                </div>
              )}
              {/* Powered by Intercom */}
              {!messageInput && (
                <div className="row flex flex-col  justify-center w-full">
                  <div className="row grid grid-cols-3  bg-white justify-between absolute left-0 bottom-6 w-full py-3 ">
                    <div
                      onClick={() => {
                        setHome(true),
                          setHelp(false),
                          setMsg(false),
                          setMessageInput(false);
                      }}
                      className="col flex cursor-pointer flex-col justify-center items-center"
                    >
                      <AiFillHome />
                      <span>Home</span>
                    </div>
                    <div
                      onClick={() => {
                        setHome(false), setHelp(false), setMsg(true);
                      }}
                      className="col cursor-pointer flex flex-col justify-center items-center"
                    >
                      <AiFillMessage />
                      <span>Message</span>
                    </div>
                    <div
                      onClick={() => {
                        setHome(false), setHelp(true), setMsg(false);
                      }}
                      className="col cursor-pointer flex flex-col justify-center items-center"
                    >
                      <BiHelpCircle />
                      <span>Help</span>
                    </div>
                  </div>
                </div>
              )}
              {messages.length <= 0 && (
                <div
                  className={`row absolute z-0 b ${
                    messageInput ? "bottom-20" : "bottom-0"
                  } w-full left-0  flex flex-col  justify-center`}
                >
                  <p className="flex text-gray-500 text-xs justify-center items-center gap-3 py-2">
                    <FaIntercom /> Powered by Intercom
                  </p>
                </div>
              )}
            </div>
          </form>
        </Model>
      )}
      {/* Chat Toggle Button */}
      <button
        onClick={handleChat}
        className="fixed  bottom-[10px]  right-[10px] bg-pink-600 p-2 rounded-full"
      >
        {chat ? (
          <FaAngleDown className="text-4xl text-white" />
        ) : (
          <BiSolidMessageAlt className="text-4xl text-white" />
        )}
      </button>
    </div>
  );
};

export default Layouts;
