import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Click | Community Member Registration & Management",
  description: "Simple, beautiful community member registration platform with Google Form integration.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f5f5f7] text-[#1d1d1f] antialiased selection:bg-blue-500 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
