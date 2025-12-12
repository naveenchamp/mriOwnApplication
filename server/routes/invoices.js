const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice
} = require("../controllers/invoiceController");

router.get("/", auth, getInvoices);
router.get("/:id", auth, getInvoiceById);
router.post("/", auth, createInvoice);
router.put("/:id", auth, updateInvoice);
router.delete("/:id", auth, deleteInvoice);

module.exports = router;
