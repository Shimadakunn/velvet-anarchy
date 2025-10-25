import type { Metadata } from "next";
import "./globals.css";
import { helveticaNeue, dirtyline } from "@/lib/fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${helveticaNeue.variable} ${dirtyline.variable} relative font-medium antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <Provider>
          <div className="flex-1">{children}</div>
          <Cart />
        </Provider>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
