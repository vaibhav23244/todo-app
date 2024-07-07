import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuthContext } from "@/context";

const Home = () => {
  const { isLogin } = useAuthContext();
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex px-20">
      <div className="w-1/2 flex justify-start items-center">
        <img src="/assets/space.svg" alt="logo" width={435} />
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <div className="flex flex-col gap-7 justify-center items-center">
          <h1 className="tracking-tight text-4xl font-semibold">
            Welcome to the TODO-List App
          </h1>
          <h3 className="tracking-tight text-lg">
            Seamlessly create, update, and manage your daily chores with ease!
          </h3>
          <Button
            onClick={
              isLogin ? () => navigate("/notes") : () => navigate("/auth")
            }
            variant="link"
            className="tracking-tight text-lg hover:text-violet-500"
          >
            Get Started Today &rarr;
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
