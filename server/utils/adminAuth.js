/* global Buffer, process */
import crypto from "crypto";

const ADMIN_TOKEN_TTL_SECONDS = 60 * 60 * 8;

const toBase64Url = (value) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const fromBase64Url = (value) => {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
};

const getTokenSecret = () => process.env.ADMIN_TOKEN_SECRET || "change-this-admin-token-secret";

const sign = (payloadBase64) =>
  toBase64Url(crypto.createHmac("sha256", getTokenSecret()).update(payloadBase64).digest());

const safeCompare = (left, right) => {
  if (typeof left !== "string" || typeof right !== "string") return false;
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

export const createAdminToken = (adminEmail) => {
  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = toBase64Url(
    JSON.stringify({
      sub: "admin",
      role: "admin",
      email: adminEmail,
      exp: Math.floor(Date.now() / 1000) + ADMIN_TOKEN_TTL_SECONDS,
    })
  );
  const signature = sign(`${header}.${payload}`);
  return `${header}.${payload}.${signature}`;
};

export const verifyAdminToken = (token) => {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expectedSignature = sign(`${header}.${payload}`);
  if (!safeCompare(signature, expectedSignature)) return null;

  try {
    const decodedPayload = JSON.parse(fromBase64Url(payload));
    if (!decodedPayload?.exp || decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    if (decodedPayload.role !== "admin") return null;
    return decodedPayload;
  } catch {
    return null;
  }
};

export const authenticateAdmin = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Admin authentication required" });
  }

  const payload = verifyAdminToken(token);
  if (!payload) {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }

  req.admin = payload;
  return next();
};

export const isValidAdminCredential = (email, password) => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@painting.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  return safeCompare(String(email || "").trim(), adminEmail.trim()) && safeCompare(String(password || ""), adminPassword);
};

export const getAdminEmail = () => process.env.ADMIN_EMAIL || "admin@painting.com";
