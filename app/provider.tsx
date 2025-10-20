"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Provider({ children }: { children: ReactNode }) {
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "AVLF9p2pStHoFLiL1PYPzHJi10LsEzFVtRFhkhFmzavSsmga0z2IF7lVatjeO5caxp3j-CQUpVj91DtY",
      }}
    >
      <ConvexProvider client={convex}>{children}</ConvexProvider>
    </PayPalScriptProvider>
  );
}
