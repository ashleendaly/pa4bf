import Image from "next/image";

export function PictureGrid() {
  const arr = Array.from(Array(10));

  return (
    <div className="grid grid-cols-4 gap-4">
      {arr.map((_, i) => (
        <Image key={i} width={200} height={200} src="/test.png" alt="" />
      ))}
    </div>
  );
}
