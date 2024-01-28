import Image from "next/image";
import { Card, CardContent, CardFooter } from "./ui/card";
import { cn } from "~/lib/utils";

export function PictureCard({
  picture: { caption, url, id },
  selected,
}: {
  picture: { caption: string; id: number; url: string };
  selected: boolean;
}) {
  return (
    <Card className={cn(selected && "scale-105")}>
      <CardContent>
        <Image src={url} width={100} height={100} alt={caption} />
      </CardContent>
      <CardFooter>
        <p>{caption}</p>
      </CardFooter>
    </Card>
  );
}
