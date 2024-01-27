import { type ReactNode } from "react";

interface pageProps {
  children: ReactNode;
  organiser: ReactNode;
  member: ReactNode;
}

export default async function Layout(props: pageProps) {
  const isOrganiser = false;

  return <>{isOrganiser ? props.organiser : props.member}</>;
}
