import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

import Nav from "./components/Nav";
import Topbar from "./components/Topbar";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Ledger from "./pages/Ledger";
import Vendors from "./pages/Vendors";
import Customers from "./pages/Customers";
import Exchange from "./pages/Exchange";
import Risk from "./pages/Risk";
import Users from "./pages/Users";
import Audit from "./pages/Audit";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AIInsig from "./pages/AIInsig";

import ProtectedRoute from "./Protected";
import PublicRoute from "./PublicRoute";
import { AuthProvider } from "./context/AuthContext";

import LoginModal from "./components/LoginModal";

export default function RouterApp() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Landing openLogin={() => setShowLoginModal(true)} />
                </PublicRoute>
              }
            />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* PROTECTED ROUTES */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }}>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Layout {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }}>
                    <Projects />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <Layout {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }}>
                    <ProjectDetails />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/invoices"
              element={
                <ProtectedRoute>
                  <Layout {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }}>
                    <Invoices />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/ledger"
              element={
                <ProtectedRoute>
                  <Layout {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }}>
                    <Ledger />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/vendors"
              element={
                <ProtectedRoute>
                  <Layout {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }}>
                    <Vendors />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Layout {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }}>
                    <Customers />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <Layout {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }}>
                    <Payments />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/exchange"
              element={
                <ProtectedRoute>
                  <Layout {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }}>
                    <Exchange />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/risk"
              element={
                <ProtectedRoute>
                  <Layout {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }}>
                    <Risk />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Layout {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }}>
                    <Users />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/audit"
              element={
                <ProtectedRoute>
                  <Layout {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }}>
                    <Audit />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/insights"
              element={
                <ProtectedRoute>
                  <Layout {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }}>
                    <AIInsig />
                  </Layout>
                </ProtectedRoute>
              }
            />

          </Routes>

          {/* LOGIN MODAL FOR LANDING PAGE */}
          <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}

/* ---------- LAYOUT COMPONENT ---------- */

function Layout({ children, collapsed, setCollapsed, mobileOpen, setMobileOpen, isMobile }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Nav
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        isMobile={isMobile}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div style={{ flex: 1 }}>
        <Topbar
          collapsed={collapsed}
          toggleSidebar={() =>
            isMobile ? setMobileOpen(s => !s) : setCollapsed(s => !s)
          }
        />

        {children}
      </div>
    </div>
  );
}
