import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ConfirmationMail } from "@/components/ConfirmationMail";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
  variants: {
    color: string;
    size: string;
  };
}

interface SendConfirmationRequest {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendConfirmationRequest = await request.json();

    const {
      customerEmail,
      customerName,
      orderId,
      items,
      subtotal,
      shipping,
      tax,
      total,
    } = body;

    // Validate required fields
    if (
      !customerEmail ||
      !customerName ||
      !orderId ||
      !items ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Order Confirmation - #${orderId}`,
      react: (
        <ConfirmationMail
          customerName={customerName}
          orderId={orderId}
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
        />
      ),
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Failed to send confirmation email", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Confirmation email sent successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in send-confirmation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
