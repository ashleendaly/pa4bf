"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

const formSchema = z.object({
  description: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  points: z.number().min(1, {
    message: "Add a number larger than 0.",
  }),
});

export function NewTaskForm({ groupId }: { groupId: number }) {
  const { mutateAsync: createTaskAsync } =
    api.group.admin.makeTask.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  function onSubmit({ description, points }: z.infer<typeof formSchema>) {
    void toast.promise(createTaskAsync({ description, points, groupId }), {
      success: "success",
      loading: "loading...",
      error: "error",
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-3xl gap-4 space-y-8"
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descriptions</FormLabel>
              <FormControl>
                <Input placeholder="My Group" {...field} />
              </FormControl>
              <FormDescription>A description of a task</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="points"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points</FormLabel>
              <FormControl>
                <Input placeholder="My Group" {...field} />
              </FormControl>
              <FormDescription>
                How many points should be awarded for this task
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
