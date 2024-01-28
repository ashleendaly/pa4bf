import Image from "next/image";
import { cn } from "~/lib/utils";
import { Separator } from "./ui/separator";

export function PictureCard({
  picture: { caption, url, id },
  selected,
}: {
  picture: { caption: string; id: number; url: string };
  selected: boolean;
}) {
  return (
    <div className={cn(selected && "scale-105")}>
      <div className="pt-4.5">
        <Image
          src={url}
          width={100}
          height={100}
          alt={caption}
          className="w-full rounded-sm"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Separator className="w-3/4" />
        <p>{caption}</p>
      </div>
    </div>
  );
}
