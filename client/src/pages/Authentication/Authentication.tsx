import AuthLogic from "./components/AuthLogic";

const Authentication = () => {
  return (
    <div className="w-full flex flex-row h-screen px-20">
      <div className="w-1/2 flex justify-start items-center">
        <img src="/assets/notes.svg" alt="logg" width={400} />
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <AuthLogic />
      </div>
    </div>
  );
};

export default Authentication;
