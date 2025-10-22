import * as React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Text,
  Section,
  Button,
} from "@react-email/components";

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
  variants: {
    color: string;
    size: string;
  };
}

interface ConfirmationMailProps {
  customerName: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export function ConfirmationMail({
  customerName,
  orderId,
  items,
  subtotal,
  shipping,
  tax,
  total,
}: ConfirmationMailProps) {
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
                color: "#000",
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              Order Confirmed!
            </Text>
            <Text style={{ color: "#666", fontSize: "16px" }}>
              Thank you for your purchase, {customerName}
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
          </Section>

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
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                </table>
                <Text
                  style={{ fontSize: "14px", color: "#666", margin: "5px 0" }}
                >
                  {item.variants.color} / {item.variants.size}
                </Text>
                <Text
                  style={{ fontSize: "14px", color: "#666", margin: "5px 0" }}
                >
                  Quantity: {item.quantity}
                </Text>
                <Text
                  style={{ fontSize: "14px", color: "#666", margin: "5px 0" }}
                >
                  Price: ${item.price.toFixed(2)} each
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
                  ${subtotal.toFixed(2)}
                </td>
              </tr>
            </table>
            <table width="100%" style={{ marginBottom: "10px" }}>
              <tr>
                <td style={{ color: "#666" }}>Shipping</td>
                <td style={{ color: "#000", textAlign: "right" }}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
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
                  ${tax.toFixed(2)}
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
                  ${total.toFixed(2)}
                </td>
              </tr>
            </table>
          </Section>

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
              You can track your order status anytime
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
