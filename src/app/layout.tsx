import "~/styles/globals.css";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Inter as FontSans } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <UserProvider>
        <body className={cn("font-sans", fontSans.variable)}>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </UserProvider>
    </html>
  );
}
