export const product = {
  id: 1,
  name: "tHrEe RoW peArL BaS ReLiEf CHokER",
  detail:
    "ViVi Nana necklace with peerls and beads, in gold-plated brass. Adjustable length: from 32 cm to 37 cm. Made in Italy.",
  images: [
    "/image/1.png",
    "/image/2.png",
    "/image/3.png",
    "/image/4.png",
    "/image/5.png",
    "/image/1.png",
    "/image/2.png",
    "/image/3.png",
    "/image/4.png",
    "/image/5.png",
  ],
  price: 120,
  rating: 4.6,
  reviews: 1192,
  sold: 1190,
  stock: 11,
  variants: [],
};

export const variants = [
  {
    id: 1,
    productId: 1,
    type: "size" as const,
    value: "ONE SIZE",
  },
  {
    id: 2,
    productId: 1,
    type: "color" as const,
    value: "Blue",
  },
  {
    id: 3,
    productId: 1,
    type: "color" as const,
    value: "Red",
  },
  {
    id: 4,
    productId: 1,
    type: "color" as const,
    value: "Green",
  },
];
