// =====================
// server/index.js
// =====================
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------------
// CORS — REQUIRED for cookies
// -----------------------------
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // 🔥 IMPORTANT
  })
);

// -----------------------------
app.use(express.json());
app.use(cookieParser());

// -----------------------------
// ROUTES
// -----------------------------
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const invoiceRoutes = require("./routes/invoices");
const vendorRoutes = require("./routes/vendors");
const customerRoutes = require("./routes/customers");
const paymentRoutes = require("./routes/payments");
const exchangeRoutes = require("./routes/exchange");
const insightRoutes = require("./routes/insights");
const auditRoutes = require("./routes/audit");
const accountsRoutes = require("./routes/accounts");
const journalRoutes = require("./routes/journalEntries");
const riskRoutes = require("./routes/risk");

// Attach routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/vendors", vendorRoutes);
app.use("/customers", customerRoutes);
app.use("/payments", paymentRoutes);
app.use("/exchange", exchangeRoutes);
app.use("/insights", insightRoutes);
app.use("/audit", auditRoutes);
app.use("/accounts", accountsRoutes);
app.use("/journal", journalRoutes);
app.use("/risk", riskRoutes);

// -----------------------------
// HEALTH CHECK
// -----------------------------
app.get("/", (req, res) => {
  res.send("ERP Server Running...");
});

// -----------------------------
// PROPER 404 HANDLER
// (Do NOT use app.get('*'))
// -----------------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// -----------------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
