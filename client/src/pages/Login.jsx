import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
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

  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const userRef = React.useRef(null);
  const passRef = React.useRef(null);

  const submit = async () => {
    setMsg("");
    setFieldError("");

    if (!username.trim() || !password) {
      setFieldError("Please enter username and password.");
      if (!username.trim()) userRef.current?.focus();
      else passRef.current?.focus();
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", { username, password });

      // BACKEND does NOT send token. Cookie is already set.
      if (res.data?.success) {
        // Notify context that user is now authenticated
        await login();  

        if (isModal && onSuccess) {
          onSuccess();
          return;
        }

        nav("/dashboard");
      } else {
        setMsg(res.data?.message || "Login failed");
      }
    } catch (err) {
      const text = err?.response?.data?.message || "Login failed";
      setMsg(text);
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
              cursor: "pointer"
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
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
