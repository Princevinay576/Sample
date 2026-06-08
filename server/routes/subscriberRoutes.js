import { Router } from "express";
import Subscriber from "../models/Subscriber.js";

const router = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", async (req, res) => {
  try {
    const rawEmail = req.body?.email;
    const email = String(rawEmail || "").trim().toLowerCase();

    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    await Subscriber.create({ email });
    return res.status(201).json({ message: "Subscribed successfully." });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Email is already subscribed." });
    }

    console.error("Failed to subscribe:", error);
    return res.status(500).json({ message: "Subscription failed." });
  }
});

export default router;

