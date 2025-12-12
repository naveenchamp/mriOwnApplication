import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  AuthWrapper,
  AuthCard,
  Input,
  Button,
  SwitchText,
  ErrorText,
  SuccessText
} from "../components/AuthContainer";
import { motion } from "framer-motion";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const nav = useNavigate();

  const userRef = React.useRef(null);
  const passRef = React.useRef(null);
  const confirmRef = React.useRef(null);

  // Password strength meter
  const scorePassword = (pwd) => {
    if (!pwd) return { score: 0, label: "Too short" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    const labels = ["Very weak", "Weak", "Okay", "Strong", "Very strong"];
    return { score, label: labels[score] };
  };

  const submit = async () => {
    setMsg("");
    setFieldError("");

    // Required fields
    if (!username.trim() || !password) {
      setFieldError("Username and password are required.");
      if (!username.trim()) userRef.current?.focus();
      else passRef.current?.focus();
      return;
    }

    // Password rules
    if (password.length < 8) {
      setFieldError("Password must be at least 8 characters.");
      passRef.current?.focus();
      return;
    }

    if (password !== confirm) {
      setFieldError("Passwords do not match.");
      confirmRef.current?.focus();
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/register", { username, password });

      setMsg("success");
      setTimeout(() => nav("/login"), 1400);
    } catch (err) {
      const text = err?.response?.data?.message || "Registration failed";
      setFieldError(text);
      setMsg("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <AuthCard
        as={motion.div}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          <div style={{ fontSize: 40 }}>🧑‍💻</div>
        </motion.div>

        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          Create Account
        </h2>

        {/* Username */}
        <Input
          ref={userRef}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password */}
        <Input
          ref={passRef}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Password Strength Meter */}
        {password && (() => {
          const p = scorePassword(password);
          const pct = (p.score / 4) * 100;
          const color =
            p.score <= 1 ? "#ef4444" :
            p.score === 2 ? "#f59e0b" :
            p.score === 3 ? "#60a5fa" : "#22c55e";

          return (
            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  height: 8,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 6,
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: color,
                    transition: "width 200ms ease"
                  }}
                />
              </div>

              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>
                {p.label}
              </div>
            </div>
          );
        })()}

        {/* Confirm Password */}
        <Input
          ref={confirmRef}
          placeholder="Confirm Password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {/* Submit */}
        <Button onClick={submit} disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </Button>

        <SwitchText>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#3b82f6" }}>
            Login
          </Link>
        </SwitchText>

        {/* Error */}
        {(fieldError || msg === "error") && (
          <ErrorText>
            {fieldError || "Registration failed"}
          </ErrorText>
        )}

        {/* Success */}
        {msg === "success" && (
          <SuccessText>Registered! Redirecting…</SuccessText>
        )}

      </AuthCard>
    </AuthWrapper>
  );
}
