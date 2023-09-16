import { doc, onSnapshot } from "firebase/firestore";

import { useEffect, useRef, useState } from "react";
import { db } from "../../../src/config/firebase";
const MyPDFComponent = ({ id }) => {
  const pdfRef = useRef();
  const [mediaKit, setMediaKit] = useState({});
  useEffect(() => {
    onSnapshot(doc(db, "mediaKites", id), (doc) => {
      setMediaKit({ id: id, ...doc.data() });
    });
  }, []);
  return (
    <div
      ref={pdfRef}
      className="  container-fluid bg-[#0b0927]  overflow-hidden w-full h-full  "
    >
      <div className="row relative ">
        <div className=" bg-gradient-to-r from-[#0b0927] to-pink-900"></div>
        <div className="col  pt-5 flex-col  gap-20  px-5 w-full h-full flex justify-center ">
          <div className="w-full h-full  ">
            <img
              className="w-80 h-80 rounded-full object-cover"
              src={mediaKit?.photo}
              alt=""
            />
          </div>
          <div className="w-full flex flex-col items-center justify-center md:w-[60vw] lg:w-[60vw] gap-10 md:items-start lg:items-start">
            <h1 className="text-white text-6xl md:text-left lg:text-left font-bold text-center ">
              {mediaKit?.name}
            </h1>
            <div className="flex gap-3 justify-center md:justify-start lg:justify-start my-10">
              {mediaKit?.tags?.map((item, index) => {
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
              <p className="text-white">{mediaKit?.about}</p>
            </div>
            <button className="text-2xl text-white bg-pink-600 px-24 py-8 rounded-full font-bold my-10">
              contact me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPDFComponent;
