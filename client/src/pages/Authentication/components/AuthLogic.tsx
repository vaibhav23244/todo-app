import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "@/context";
import { useToast } from "@/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";

const signUpSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().min(1, { message: "This is a required field" }).email(),
  password: z.string().min(1, { message: "This is a required field" }),
});

const loginSchema = z.object({
  email: z.string().min(1, { message: "This is a required field" }).email(),
  password: z.string().min(1, { message: "This is a required field" }),
});

const AuthLogic = () => {
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();
  const form = useForm<
    z.infer<typeof signUpSchema> | z.infer<typeof loginSchema>
  >({
    resolver: zodResolver(isSignUp ? signUpSchema : loginSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    reset({
      name: "",
      email: "",
      password: "",
    });
  }, [isSignUp, reset]);

  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      if (isSignUp) {
        // Sign up
        const response = await axios.post("https://nodejs-backend-express-bice.vercel.app/user/signup", {
          name: values.name,
          email: values.email,
          password: values.password,
        });
        const responseData = response.data;
        if (responseData.status === true) {
          setIsLoading(false);
          login(responseData.user);
          localStorage.setItem("user", JSON.stringify(responseData));
        } else {
          setIsLoading(false);
          toast({
            title: "Something went wrong!",
            description: responseData.message,
          });
        }
      } else {
        // Login
        const response = await axios.post("https://nodejs-backend-express-bice.vercel.app/user/login", {
          email: values.email,
          password: values.password,
        });
        const responseData = response.data;
        if (responseData.status === true) {
          setIsLoading(false);
          login(responseData.user);
          localStorage.setItem("user", JSON.stringify(responseData));
        } else {
          setIsLoading(false);
          toast({
            title: "Something went wrong!",
            description: responseData.message,
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Something went wrong!",
        description: "We are having trouble connecting to the database",
      });
    }
  };

  return (
    <div className="w-[85%] flex flex-col gap-7">
      {isSignUp ? (
        <>
          <h1 className="tracking-tight text-2xl font-semibold">
            Create a new account
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="tracking-tight text-[15px] font-semibold">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="tracking-tight text-[15px] font-semibold">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="tracking-tight text-[15px] font-semibold">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="•••••" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isLoading ? (
                <Button
                  disabled
                  className="w-full bg-black text-white text-[15px]"
                  type="submit"
                >
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  className="w-full bg-black text-white text-[15px] hover:bg-violet-500"
                  type="submit"
                >
                  Submit
                </Button>
              )}
            </form>
          </Form>
          <h3
            className={
              isLoading ? `hidden` : ` tracking-tight text-[15px] font-semibold`
            }
          >
            Already have an account?
            <span>
              <Button
                onClick={() => setIsSignUp(false)}
                variant="link"
                className="hover:text-violet-500 text-[15px]"
              >
                Login to an existing account &rarr;
              </Button>
            </span>
          </h3>
        </>
      ) : (
        <>
          <h1 className="tracking-tight text-2xl font-semibold">
            Login to continue
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="tracking-tight text-[15px] font-semibold">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="tracking-tight text-[15px] font-semibold">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="•••••" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isLoading ? (
                <Button
                  disabled
                  className="w-full bg-black text-white text-[15px]"
                  type="submit"
                >
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  className="w-full bg-black text-white text-[15px] hover:bg-violet-500"
                  type="submit"
                >
                  Submit
                </Button>
              )}
            </form>
          </Form>
          <h3
            className={
              isLoading ? `hidden` : ` tracking-tight text-[15px] font-semibold`
            }
          >
            Don&apos;t have an account?
            <span>
              <Button
                onClick={() => setIsSignUp(true)}
                variant="link"
                className="hover:text-violet-500 text-[15px]"
              >
                Create one &rarr;
              </Button>
            </span>
          </h3>
        </>
      )}
    </div>
  );
};

export default AuthLogic;
