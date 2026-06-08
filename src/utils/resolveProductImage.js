import { productImages } from "../data/productImages";

export const resolveProductImage = (product) => {
  if (product?.imageUrl) return product.imageUrl;
  if (product?.imageKey && productImages[product.imageKey]) {
    return productImages[product.imageKey];
  }
  return productImages.item1;
};

