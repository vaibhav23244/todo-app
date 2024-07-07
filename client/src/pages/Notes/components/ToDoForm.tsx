import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNoteContext } from "@/context/notesContext";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "This is a required field",
    })
    .max(50, {
      message: "The item to be added can not be more than 50 characters long",
    }),
});

const ToDoForm = () => {
  const { createNote } = useNoteContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { reset } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createNote(values.name);
      reset();
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  }
  return (
    <div className="w-full max-w-3xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row gap-7 items-center justify-center mb-7"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Add a new TODO item"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-black text-white text-[17px] hover:bg-violet-500"
          >
            Create &rarr;
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ToDoForm;
