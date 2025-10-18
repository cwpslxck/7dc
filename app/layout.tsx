import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

const font = Rubik({
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "7 apps challenge by @cwpslxck",
  generator: "@cwpslxck",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={font.className}>
        <div className="h-full min-h-dvh w-full">
          <Header />
          <div className="px-4 pt-16 mx-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
