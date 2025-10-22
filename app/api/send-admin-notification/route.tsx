import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { AdminNotificationMail } from "@/components/AdminNotificationMail";

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

interface ShippingAddress {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface SendAdminNotificationRequest {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendAdminNotificationRequest = await request.json();

    const {
      customerEmail,
      customerName,
      orderId,
      items,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
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

    // Check if admin email is configured
    const adminEmail = process.env.ADMIN_MAIL;
    if (!adminEmail) {
      console.error("ADMIN_MAIL environment variable is not set");
      return NextResponse.json(
        { error: "Admin email not configured" },
        { status: 500 }
      );
    }

    // Send email to admin using Resend
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `New Order Received - #${orderId}`,
      react: (
        <AdminNotificationMail
          customerName={customerName}
          customerEmail={customerEmail}
          orderId={orderId}
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
          shippingAddress={shippingAddress}
        />
      ),
    });

    if (error) {
      console.error("Error sending admin notification email:", error);
      return NextResponse.json(
        { error: "Failed to send admin notification email", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Admin notification email sent successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in send-admin-notification API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
