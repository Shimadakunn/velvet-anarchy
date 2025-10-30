import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Section,
  Text,
} from "@react-email/components";

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
  variants: Record<string, string>;
}

interface CustomerMailProps {
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
  shippingAddress?: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

const getShippingStatusConfig = (
  status: string
): {
  title: string;
  message: string;
  icon: string;
  color: string;
} => {
  const configs = {
    pending: {
      title: "Order Confirmed!",
      message:
        "Thank you for your purchase! We've received your order and will start processing it soon. You'll receive shipping updates as your order progresses.",
      icon: "✅",
      color: "#10B981",
    },
    processing: {
      title: "Order is Being Processed",
      message:
        "Great news! We're currently preparing your order for shipment. Your items are being carefully packaged.",
      icon: "📦",
      color: "#F59E0B",
    },
    shipped: {
      title: "Your Order Has Been Shipped!",
      message:
        "Exciting news! Your order has left our warehouse and is on its way to you.",
      icon: "🚀",
      color: "#3B82F6",
    },
    in_transit: {
      title: "Your Order is In Transit",
      message:
        "Your package is currently on its way to you. It's moving through our delivery network.",
      icon: "🚚",
      color: "#6366F1",
    },
    out_for_delivery: {
      title: "Out for Delivery Today!",
      message:
        "Your package is out for delivery and should arrive today. Please ensure someone is available to receive it.",
      icon: "🚛",
      color: "#06B6D4",
    },
    delivered: {
      title: "Order Delivered!",
      message:
        "Your order has been successfully delivered. We hope you enjoy your purchase!",
      icon: "✅",
      color: "#10B981",
    },
  };

  return (
    configs[status as keyof typeof configs] || {
      title: "Order Update",
      message: "There's an update on your order status.",
      icon: "📬",
      color: "#6B7280",
    }
  );
};

const formatVariants = (variants: Record<string, string>) => {
  return Object.entries(variants)
    .filter(([, value]) => value)
    .map(([, value]) => `${value}`)
    .join(" / ");
};

export function CustomerMail({
  customerName,
  orderId,
  shippingStatus,
  items,
  subtotal,
  shipping,
  tax,
  total,
  shippingAddress,
}: CustomerMailProps) {
  const config = getShippingStatusConfig(shippingStatus);
  const showPricing =
    subtotal !== undefined &&
    shipping !== undefined &&
    tax !== undefined &&
    total !== undefined;

  return (
    <Html>
      <Head />
      <Body
        style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#fff" }}
      >
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}
        >
          {/* Header */}
          <Section style={{ textAlign: "center", marginBottom: "30px" }}>
            <Text
              style={{
                fontSize: "48px",
                marginBottom: "10px",
                lineHeight: "1",
              }}
            >
              {config.icon}
            </Text>
            <Text
              style={{
                color: config.color,
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              {config.title}
            </Text>
            <Text style={{ color: "#666", fontSize: "16px" }}>
              Hello {customerName},
            </Text>
          </Section>

          {/* Status Message */}
          <Section
            style={{
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
              borderLeft: `4px solid ${config.color}`,
            }}
          >
            <Text
              style={{
                fontSize: "16px",
                color: "#333",
                margin: "0",
                lineHeight: "1.5",
              }}
            >
              {config.message}
            </Text>
          </Section>

          {/* Order Details */}
          <Section
            style={{
              backgroundColor: "#f5f5f5",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <Text
              style={{ fontSize: "14px", color: "#666", margin: "0 0 5px 0" }}
            >
              Order Number
            </Text>
            <Text
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#000",
                margin: "0",
              }}
            >
              {orderId}
            </Text>

            {/* Shipping Status for non-pending */}
            {shippingStatus !== "pending" && (
              <>
                <Text
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    margin: "15px 0 5px 0",
                  }}
                >
                  Shipping Status
                </Text>
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: config.color,
                    margin: "0",
                    textTransform: "capitalize",
                  }}
                >
                  {shippingStatus.replace(/_/g, " ")}
                </Text>
              </>
            )}
          </Section>

          {/* Shipping Address */}
          {shippingAddress && (
            <Section
              style={{
                backgroundColor: "#f9f9f9",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <Text
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  color: "#000",
                }}
              >
                Delivery Address
              </Text>
              <Text
                style={{ fontSize: "14px", color: "#333", margin: "5px 0" }}
              >
                {shippingAddress.name}
              </Text>
              <Text
                style={{ fontSize: "14px", color: "#333", margin: "5px 0" }}
              >
                {shippingAddress.addressLine1}
              </Text>
              {shippingAddress.addressLine2 && (
                <Text
                  style={{ fontSize: "14px", color: "#333", margin: "5px 0" }}
                >
                  {shippingAddress.addressLine2}
                </Text>
              )}
              <Text
                style={{ fontSize: "14px", color: "#333", margin: "5px 0" }}
              >
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.postalCode}
              </Text>
              <Text
                style={{ fontSize: "14px", color: "#333", margin: "5px 0" }}
              >
                {shippingAddress.country}
              </Text>
            </Section>
          )}

          {/* Order Items */}
          <Section style={{ marginBottom: "30px" }}>
            <Text
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "15px",
                color: "#000",
              }}
            >
              Order Summary
            </Text>
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  borderBottom: "1px solid #e5e5e5",
                  paddingBottom: "15px",
                  marginBottom: "15px",
                }}
              >
                <table width="100%" style={{ marginBottom: "5px" }}>
                  <tr>
                    <td style={{ fontWeight: "600", color: "#000" }}>
                      {item.productName}
                    </td>
                    <td
                      style={{
                        fontWeight: "600",
                        color: "#000",
                        textAlign: "right",
                      }}
                    >
                      €{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                </table>
                <Text
                  style={{ fontSize: "14px", color: "#666", margin: "5px 0" }}
                >
                  {formatVariants(item.variants)}
                </Text>
                <Text
                  style={{ fontSize: "14px", color: "#666", margin: "5px 0" }}
                >
                  Quantity: {item.quantity}
                </Text>
              </div>
            ))}
          </Section>

          {/* Price Breakdown */}
          {showPricing && (
            <Section
              style={{
                backgroundColor: "#f5f5f5",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "30px",
              }}
            >
              <table width="100%" style={{ marginBottom: "10px" }}>
                <tr>
                  <td style={{ color: "#666" }}>Subtotal</td>
                  <td style={{ color: "#000", textAlign: "right" }}>
                    €{subtotal.toFixed(2)}
                  </td>
                </tr>
              </table>
              <table width="100%" style={{ marginBottom: "10px" }}>
                <tr>
                  <td style={{ color: "#666" }}>Shipping</td>
                  <td style={{ color: "#000", textAlign: "right" }}>
                    {shipping === 0 ? "FREE" : `€${shipping.toFixed(2)}`}
                  </td>
                </tr>
              </table>
              <table
                width="100%"
                style={{
                  marginBottom: "15px",
                  paddingBottom: "15px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <tr>
                  <td style={{ color: "#666" }}>Tax</td>
                  <td style={{ color: "#000", textAlign: "right" }}>
                    €{tax.toFixed(2)}
                  </td>
                </tr>
              </table>
              <table width="100%">
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#000",
                    }}
                  >
                    Total
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "#000",
                      textAlign: "right",
                    }}
                  >
                    €{total.toFixed(2)}
                  </td>
                </tr>
              </table>
            </Section>
          )}

          {/* Tracking Info */}
          <Section
            style={{
              textAlign: "center",
              marginBottom: "30px",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <Text
              style={{ color: "#666", fontSize: "14px", marginBottom: "15px" }}
            >
              Track your order status anytime
            </Text>
            <Button
              href={`${process.env.APP_URL}/track?orderId=${orderId}`}
              style={{
                backgroundColor: "#000",
                color: "#fff",
                padding: "12px 30px",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "600",
                display: "inline-block",
              }}
            >
              Track Your Order
            </Button>
          </Section>

          {/* Footer */}
          <Section
            style={{
              textAlign: "center",
              color: "#999",
              fontSize: "12px",
              paddingTop: "20px",
              borderTop: "1px solid #e5e5e5",
            }}
          >
            <Text style={{ margin: "5px 0" }}>
              If you have any questions, please contact our support team.
            </Text>
            <Text style={{ margin: "5px 0" }}>
              Thank you for shopping with us!
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
