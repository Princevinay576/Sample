import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageKey: {
      type: String,
      enum: ["item1", "item2", "item3", "item4", "item5"],
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

productSchema.path("imageUrl").validate((value) => {
  if (!value) return true;
  return /^https?:\/\/.+/i.test(value);
}, "imageUrl must be a valid http/https URL");

productSchema.pre("validate", function ensureAnyImage(next) {
  if (!this.imageKey && !this.imageUrl) {
    this.invalidate("imageKey", "Either imageKey or imageUrl is required");
  }
  next();
});

export default mongoose.model("Product", productSchema);
