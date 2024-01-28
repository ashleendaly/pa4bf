import { type ClassValue } from "clsx";
import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

export function PageWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: ClassValue;
}) {
  return (
    <section className={cn("mx-auto h-[90dvh] w-full max-w-5xl", className)}>
      {children}
    </section>
  );
}
