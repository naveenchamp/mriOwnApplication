// client/src/components/LoginModal.jsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../pages/Login";

export default function LoginModal({ open, onClose }) {
  // ------------------------------
  // Close on ESC key
  // ------------------------------
  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  // ------------------------------
  // Prevent background scroll
  // ------------------------------
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-bg"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <motion.div
            key="modal-card"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{ duration: 0.4, type: "spring" }}
            style={{
              width: "420px",
              maxWidth: "92%",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* Login Modal Crux */}
            <Login isModal={true} onSuccess={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
