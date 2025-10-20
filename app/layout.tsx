import type { Metadata } from "next";
import "./globals.css";
import { helveticaNeue, dirtyline } from "@/lib/fonts";
import { Header } from "@/components/Header";
import { Toaster } from "sonner";
import { Provider } from "./provider";
import Cart from "@/components/Cart";

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
        <Provider>
          {children}
          <Cart />
        </Provider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
