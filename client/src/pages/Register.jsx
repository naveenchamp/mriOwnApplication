// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  AuthWrapper,
  AuthCard,
  Input,
  Button,
  SwitchText,
  ErrorText,
} from "../components/AuthContainer";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ isModal = false, onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const { refreshUser } = useAuth();   // ✅ NEW – loads user from /auth/me
  const nav = useNavigate();

  const userRef = React.useRef(null);
  const passRef = React.useRef(null);

  const submit = async () => {
    setMsg("");
    setFieldError("");

    if (!username.trim() || !password) {
      setFieldError("Please enter username and password.");
      (!username.trim() ? userRef : passRef).current?.focus();
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/login", { username, password }, { withCredentials: true });

      // 🔥 Load logged-in user from cookie
      await refreshUser();

      if (isModal && onSuccess) return onSuccess();

      // Redirect
      nav("/dashboard");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper style={isModal ? { marginLeft: 0, height: "auto" } : {}}>
      <AuthCard
        as={motion.div}
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.92 }}
        transition={{ duration: 0.55, type: "spring" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          <div style={{ fontSize: 40 }}>🔐</div>
        </motion.div>

        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Welcome Back</h2>

        <Input
          ref={userRef}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div style={{ position: "relative" }}>
          <Input
            ref={passRef}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => setShowPassword((s) => !s)}
            type="button"
            style={{
              position: "absolute",
              right: 10,
              top: 10,
              background: "transparent",
              border: "none",
              color: "#cbd5e1",
              cursor: "pointer",
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 6,
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />{" "}
            Remember me
          </label>
          <Link to="/forgot" style={{ color: "#60a5fa" }}>
            Forgot?
          </Link>
        </div>

        <Button
          as={motion.button}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </Button>

        {!isModal && (
          <SwitchText>
            No account? <Link to="/register">Register</Link>
          </SwitchText>
        )}

        {fieldError && <ErrorText>{fieldError}</ErrorText>}
        {msg && <ErrorText>{msg}</ErrorText>}
      </AuthCard>
    </AuthWrapper>
  );
}
