"use client";
import { UploadButton as UploadThingButton } from "~/lib/uploadthing";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export function UploadButton({
  groupId,
  taskId,
  userId,
}: {
  groupId: number;
  taskId: number;
  userId: string;
}) {
  const { mutateAsync: uploadAsync } = api.picture.upload.useMutation();
  return (
    <Button className="grid h-max place-items-center">
      <UploadThingButton
        className="w-full"
        endpoint="imageUploader"
        content={{
          button({ isUploading }) {
            return (
              <div className="flex items-center gap-4 text-xl">
                <Upload
                  className={cn(
                    "h-8 w-8 cursor-pointer stroke-slate-500",
                    isUploading && "stroke-slate-400",
                  )}
                />
                Upload Photo
              </div>
            );
          },
          allowedContent() {
            return <></>;
          },
        }}
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          res.map((f) =>
            toast.promise(
              uploadAsync({ groupId, taskId, caption: "", url: f.url, userId }),
              {
                loading: "Loading...",
                success: "photo uploaded!",
                error: "Something went wrong...",
              },
            ),
          );
          return;
        }}
        onUploadError={(error: Error) => {
          console.error(`ERROR! ${error.message}`);
          toast.error("Error uploading photo!");
        }}
      />
    </Button>
  );
}
