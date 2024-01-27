import { Aperture } from "lucide-react";

export function Header() {
  return (
    <div className="flex h-[10dvh] items-center justify-start bg-background px-10">
      <h1 className="flex items-center gap-3">
        <Aperture className="h-9 w-9" />
        PA4BF
      </h1>
    </div>
  );
}
