"use client";
import { UploadButton as UploadThingButton } from "~/lib/uploadthing";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { cn } from "~/lib/utils";

export function UploadButton() {
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
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </Button>
  );
}
