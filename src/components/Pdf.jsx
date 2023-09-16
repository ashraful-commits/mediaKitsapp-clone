import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../config/firebase";

/**
 * MyPDFComponent is a React component for displaying a PDF media kit.
 *
 * @param {string} id - The ID of the media kit document in Firestore.
 * @returns {JSX.Element} - A React JSX element representing the PDF media kit.
 */
const MyPDFComponent = ({ id }) => {
  // Ref for the PDF component
  const pdfRef = useRef();

  // State to hold the media kit data
  const [mediaKit, setMediaKit] = useState({});

  // Fetch media kit data from Firestore
  useEffect(() => {
    onSnapshot(doc(db, "mediaKites", id), (doc) => {
      setMediaKit({ id: id, ...doc.data() });
    });
  }, []);

  return (
    <div
      ref={pdfRef}
      className="container-fluid bg-[#0b0927] overflow-hidden w-full h-full"
    >
      {/* Rest of the component JSX */}
      {/* ... */}
    </div>
  );
};

export default MyPDFComponent;
