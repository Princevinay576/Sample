import cors from "cors";
import express from "express";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/products", productRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/admin", adminRoutes);

export default app;
