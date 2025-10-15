import localFont from "next/font/local";

export const helveticaNeue = localFont({
  src: [
    {
      path: "../public/fonts/HelveticaNeue-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeue-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeue-Roman.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeue-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeue-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-helvetica-neue",
});

export const dirtyline = localFont({
  src: "../public/fonts/Dirtyline.ttf",
  variable: "--font-dirtyline",
});
