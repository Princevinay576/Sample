import Product from "../models/Product.js";

const defaultProducts = [
  { productId: 1, name: "Abstract Canvas", price: 20, imageKey: "item1" },
  { productId: 2, name: "Nature Portrait", price: 24, imageKey: "item2" },
  { productId: 3, name: "Golden Horizon", price: 28, imageKey: "item3" },
  { productId: 4, name: "Modern Still Life", price: 22, imageKey: "item4" },
  { productId: 5, name: "Ocean Bloom", price: 26, imageKey: "item5" },
];

export const seedProductsIfNeeded = async () => {
  const count = await Product.countDocuments();
  if (count > 0) return;

  await Product.insertMany(defaultProducts);
  console.log("Seeded default products");
};

