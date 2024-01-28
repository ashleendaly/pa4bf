import { type GridPicture, PictureGrid } from "~/components/picture-grid";

export default async function Page() {
  const top10 = [] as GridPicture[];
  return <PictureGrid data={top10} />;
}
