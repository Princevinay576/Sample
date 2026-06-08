import { Router } from "express";
import { createAdminToken, getAdminEmail, isValidAdminCredential } from "../utils/adminAuth.js";

const router = Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!isValidAdminCredential(email, password)) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const adminEmail = getAdminEmail();
  const token = createAdminToken(adminEmail);

  return res.json({
    token,
    admin: {
      email: adminEmail,
      role: "admin",
    },
  });
});

export default router;
