const Error = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-7">
      <h1 className="tracking-tight text-4xl font-semibold">Page not found</h1>
      <img src="/assets/error.svg" alt="logo" width={435} />
    </div>
  );
};

export default Error;
