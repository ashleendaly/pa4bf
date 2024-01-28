import "~/styles/globals.css";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import { type Metadata, type Viewport } from "next";
import { Inter as FontSans } from "next/font/google";

import { Header } from "~/components/header";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const APP_NAME = "PWA App";
const APP_DEFAULT_TITLE = "My Awesome PWA App";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Best PWA app in the world!";

export const metadata: Metadata = {
  icons: [{ rel: "icon", url: "/favicon.ico" }],

  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
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
          <TRPCReactProvider>
            <ThemeProvider attribute="class" defaultTheme="system">
              <Header />
              <main className="h-full min-h-[90dvh] w-full bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                {children}
              </main>
              <Toaster />
            </ThemeProvider>
          </TRPCReactProvider>
        </body>
      </UserProvider>
    </html>
  );
}
