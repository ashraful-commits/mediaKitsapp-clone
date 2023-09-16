const Model = ({ children, styleS }) => {
  return (
    <div className={`${styleS}  z-[99999] bg-white shadow-lg absolute`}>
      {children}
    </div>
  );
};

export default Model;
