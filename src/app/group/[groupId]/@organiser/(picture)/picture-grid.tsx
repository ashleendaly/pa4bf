import { type GridPicture } from "~/components/picture-grid";

export function PictureGrid({ images }: { images: GridPicture[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <PictureGrid images={images} />
    </div>
  );
}
