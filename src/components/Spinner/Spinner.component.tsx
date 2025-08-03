const Spinner = () => (
  <div className="fixed  bg-white top-0 left-0 min-w-full min-h-full">
    <div className=" min-w-full min-h-full flex items-center h-screen justify-around">
      <div className="w-16 h-16  border-6 border-b-white border-blue-500 rounded-full animate-spin"></div>
    </div>
  </div>
);

export default Spinner;
