import { useEffect, useState } from "react";
import { BsThreeDotsVertical, BsPlus } from "react-icons/bs";

import Model from "../components/Model";
import { Link } from "react-router-dom";

import { showToast } from "../Utility/Toastify";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import logo from "../../public/asset 1.svg";

const Home = () => {
  // Initialize state to store the list of media kits
  const [list, setList] = useState([]);

  // Use 'useEffect' to fetch data from Firestore when the component mounts
  useEffect(() => {
    try {
      const fetchData = async () => {
        const q = query(collection(db, "mediaKites"));

        let mediaKitList = [];
        const querySnapshot = await getDocs(q);

        // Iterate through query results and construct media kits
        querySnapshot.forEach((doc) => {
          // 'doc.data()' is never undefined for query doc snapshots
          console.log(doc.data());
          mediaKitList.push({ id: doc.id, ...doc.data() });
        });

        // Filter media kits based on the currently authenticated user
        setList(
          mediaKitList.filter((item) => item.uid === auth.currentUser.uid)
        );
      };
      fetchData();
    } catch (error) {
      showToast("error", error.message);
    }
  }, []);

  // Initialize state to manage dropdown menu visibility for each media kit
  const [dropdownStates, setDropdownStates] = useState(
    Array(list.length).fill(false)
  );

  // Function to handle deleting a media kit by its ID
  const handleDelete = async (id) => {
    console.log(id);
    try {
      await deleteDoc(doc(db, "mediaKites", id));
      // Update the list by removing the deleted media kit
      setList([...list.filter((item) => item.id !== id)]);
    } catch (error) {
      showToast("error", error.message);
    }
  };
  return (
    <div className="container-fluid w-full  min-h-screen max-h-auto bg-red-[50%]">
      <div className="row w-full h-full ">
        <div className="col mx-10 lg:px-96 flex justify-center flex-col items-center pt-32 gap-5">
          <h1 className="text-4xl  capitalize font-extrabold">my mediaKits</h1>
          <div className=" w-full justify-center items-center flex flex-wrap">
            <div className="w-full flex flex-col  justify-center items-center  md:flex-row lg:flex-row  gap-4 flex-wrap">
              {list?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="w-[230px] h-80 flex flex-col justify-center items-center gap-2 bg-white rounded-2xl shadow-sm p-3"
                  >
                    <div className="w-full flex justify-end">
                      <button
                        className="relative"
                        onClick={() => {
                          const updatedDropdownStates = [...dropdownStates];
                          updatedDropdownStates[index] =
                            !updatedDropdownStates[index];
                          setDropdownStates(updatedDropdownStates);
                        }}
                      >
                        <BsThreeDotsVertical />
                        {dropdownStates[index] && (
                          <Model styleS={"top-0 right-3 "}>
                            <ul className="flex flex-col gap-3 p-1 text-xs">
                              <li>
                                <Link to={`/edit/${item.id}`}>edit</Link>
                              </li>
                              <li>
                                <Link to={`user/${item.id}`}>view</Link>
                              </li>
                              <li>
                                <button onClick={() => handleDelete(item.id)}>
                                  delete
                                </button>
                              </li>
                            </ul>
                          </Model>
                        )}
                      </button>
                    </div>
                    <div className="flex justify-center items-center flex-col gap-5">
                      <div className="w-24 h-24 overflow-hidden bg-gradient-to-t from-pink-500 to-orange-500 rounded-full p-[2px] flex justify-center items-center">
                        <img
                          className="w-full h-full object-cover rounded-full"
                          src={item.photo}
                          alt=""
                        />
                      </div>
                      <h1>{item.name}</h1>
                    </div>
                    <div className="flex justify-center items-center gap-4 my-4">
                      <Link to="/user">
                        <img className="w-8 h-8" src={logo} alt="" />
                      </Link>
                      <span>{index + 1}</span>
                    </div>
                    <Link
                      to={`/user/${item.id}`}
                      className="text-xs bg-pink-600 w-[70%] px-4 py-2 text-white rounded-full"
                    >
                      VIEW MEDIAKIT
                    </Link>
                    <Link
                      to={`/edit/${item.id}`}
                      className="text-xs text-pink-600"
                    >
                      EDIT
                    </Link>
                  </div>
                );
              })}

              <div className="w-52 h-80 flex-col gap-4 bg-gray-300 rounded-2xl flex justify-center items-center shadow-sm">
                <div className="w-20 h-20 flex justify-center flex-col gap-3 bg-white items-center rounded-full">
                  <Link to="/create" className="w-full h-full">
                    <BsPlus className="w-full h-full shrink-0 text-gray-600" />
                  </Link>
                </div>
                <h1 className="text-sm text-gray-500">Create a new mediakit</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
