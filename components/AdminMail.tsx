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

interface AdminMailProps {
  customerName: string;
  customerEmail: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
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

const formatVariants = (variants: Record<string, string>) => {
  return Object.entries(variants)
    .filter(([, value]) => value)
    .map(([, value]) => `${value}`)
    .join(" / ");
};

export function AdminMail({
  customerName,
  customerEmail,
  orderId,
  items,
  subtotal,
  shipping,
  tax,
  total,
  shippingAddress,
}: AdminMailProps) {
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
              📬
            </Text>
            <Text
              style={{
                color: "#F59E0B",
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              New Order Received
            </Text>
            <Text style={{ color: "#666", fontSize: "16px" }}>
              Admin Notification
            </Text>
          </Section>

          {/* Status Message */}
          <Section
            style={{
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
              borderLeft: "4px solid #F59E0B",
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
              A new order has been placed and requires processing.
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
                margin: "0 0 15px 0",
              }}
            >
              {orderId}
            </Text>

            <Text
              style={{ fontSize: "14px", color: "#666", margin: "0 0 5px 0" }}
            >
              Customer Name
            </Text>
            <Text
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#000",
                margin: "0 0 15px 0",
              }}
            >
              {customerName}
            </Text>

            <Text
              style={{ fontSize: "14px", color: "#666", margin: "0 0 5px 0" }}
            >
              Customer Email
            </Text>
            <Text
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#000",
                margin: "0",
              }}
            >
              {customerEmail}
            </Text>
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
                Shipping Address
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
              Order Items
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
                <Text
                  style={{ fontSize: "14px", color: "#666", margin: "5px 0" }}
                >
                  Price: €{item.price.toFixed(2)} each
                </Text>
              </div>
            ))}
          </Section>

          {/* Price Breakdown */}
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

          {/* Admin Action */}
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
              Manage this order in the admin panel
            </Text>
            <Button
              href={`${process.env.APP_URL}/orders`}
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
              View Order in Admin Panel
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
              This is an automated notification from your e-commerce system.
            </Text>
            <Text style={{ margin: "5px 0" }}>
              Please process this order at your earliest convenience.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
