import { type GridPicture, PictureGrid } from "~/components/picture-grid";
import { api } from "~/trpc/server";

export default async function Page() {
  return <PictureGrid data={[]} />;
}
