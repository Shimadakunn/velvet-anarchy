import { CustomerMail } from "@/components/CustomerMail";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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

interface SendCustomerEmailRequest {
  customerEmail: string;
  customerName: string;
  orderId: string;
  shippingStatus:
    | "pending"
    | "processing"
    | "shipped"
    | "in_transit"
    | "out_for_delivery"
    | "delivered";
  items: OrderItem[];
  subtotal?: number;
  shipping?: number;
  tax?: number;
  total?: number;
  shippingAddress?: ShippingAddress;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendCustomerEmailRequest = await request.json();

    const {
      customerEmail,
      customerName,
      orderId,
      shippingStatus,
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
      !shippingStatus ||
      !items ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Determine subject based on shipping status
    const statusLabels: Record<string, string> = {
      pending: "Order Confirmed",
      processing: "Order Being Processed",
      shipped: "Order Shipped",
      in_transit: "Order In Transit",
      out_for_delivery: "Out for Delivery",
      delivered: "Order Delivered",
    };

    const subject = `${statusLabels[shippingStatus] || "Order Update"} - #${orderId}`;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Vivi Nana <onboarding@resend.dev>",
      to: [customerEmail],
      subject,
      react: (
        <CustomerMail
          customerName={customerName}
          orderId={orderId}
          shippingStatus={shippingStatus}
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
      console.error("Error sending customer email:", error);
      return NextResponse.json(
        { error: "Failed to send customer email", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Customer email sent successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in send-customer-email API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
