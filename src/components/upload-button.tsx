"use client";
import { UploadButton as UploadThingButton } from "~/lib/uploadthing";
import { Button } from "./ui/button";

export function UploadButton() {
  return (
    <Button className="grid h-max place-items-center">
      <UploadThingButton
        className="w-full pb-2.5"
        endpoint="imageUploader"
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
