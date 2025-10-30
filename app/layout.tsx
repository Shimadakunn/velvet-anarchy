import Cart from "@/components/Cart";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { dirtyline, helveticaNeue } from "@/lib/fonts";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Provider } from "./provider";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${helveticaNeue.variable} ${dirtyline.variable} relative font-medium antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <Provider>
          <div className="flex-1">{children}</div>
          <Cart />
          <Footer />
        </Provider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
