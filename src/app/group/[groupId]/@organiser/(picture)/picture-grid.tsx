import Image from "next/image";

export function PictureGrid({ images }: { images: { picture_url: string }[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {images.map(({ picture_url }, i) => (
        <Image key={i} width={200} height={200} src={picture_url} alt="" />
      ))}
    </div>
  );
}
