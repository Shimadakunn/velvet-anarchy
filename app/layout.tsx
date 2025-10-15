import type { Metadata } from "next";
import "./globals.css";
import { helveticaNeue, dirtyline } from "@/lib/fonts";
import { Header } from "@/components/Header";
import { Toaster, toast } from "sonner";

export const metadata: Metadata = {
  title: "Velvet Anarchy",
  description: "Girly & Luxury Jeweleries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${helveticaNeue.variable} ${dirtyline.variable}  font-medium antialiased`}
      >
        <Header />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
