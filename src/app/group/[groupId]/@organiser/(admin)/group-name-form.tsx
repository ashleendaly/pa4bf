"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  displayName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function GroupNameForm({
  organiserId,
  currentDisplayName,
  groupId,
}: {
  organiserId: string;
  currentDisplayName: string;
  groupId: number;
}) {
  const router = useRouter();
  const { mutateAsync: updateGroupAsync } =
    api.group.admin.update.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: currentDisplayName,
    },
  });

  function onSubmit({ displayName }: z.infer<typeof formSchema>) {
    void toast.promise(
      updateGroupAsync({ newName: displayName, organiserId, groupId }).then(
        () => router.refresh(),
      ),
      { success: "Group renamed", loading: "loading...", error: "error" },
    );
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-3xl gap-4 space-y-8"
      >
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="My Group" {...field} />
              </FormControl>
              <FormDescription>
                This is your group&apos;s public display name.
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
