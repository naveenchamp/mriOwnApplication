// src/components/Nav.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

// Icons
import {
  LayoutDashboard,
  FolderKanban,
  Receipt,
  ShieldAlert,
  BarChart3,
  Users,
  BookOpen,
  FileClock,
  Landmark,
  DollarSign,
  Store,
  UserCircle,
  LogOut,
} from "lucide-react";

/* ---------------- SIDEBAR ---------------- */
const Sidebar = styled.aside`
  width: ${({ $collapsed }) => ($collapsed ? "72px" : "260px")};
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.sidebar};
  color: white;
  padding: 24px 20px;
  border-right: 1px solid #1f2937;
  display: flex;
  flex-direction: column;
  transition: width 220ms ease, transform 220ms ease;

  @media (max-width: 768px) {
    width: 260px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;

    display: ${({ $mobileOpen }) => ($mobileOpen ? "flex" : "none")};
    transform: translateX(${({ $mobileOpen }) => ($mobileOpen ? "0" : "-100%")});
  }
`;

const AppTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 8px;

  .brand-short { display: none; }

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 18px;
    .full { display: none; }
    .brand-short { display: inline-block; }
  }
`;

/* ---------------- NAV ITEMS ---------------- */
const SectionTitle = styled.div`
  margin-top: 28px;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 15px;

  color: ${({ $active }) => ($active ? "#fff" : "#cbd5e1")};
  background: ${({ $active }) =>
    $active ? "rgba(255,255,255,0.08)" : "transparent"};
  transition: 0.25s ease;

  .label {
    display: ${({ $collapsed }) => ($collapsed ? "none" : "inline-block")};
  }

  &:hover {
    background: rgba(255,255,255,0.08);
    color: white;
  }

  @media (max-width: 768px) {
    justify-content: center;
    gap: 0;
    .label { display: none; }
  }
`;

/* ---------------- FOOTER BUTTONS ---------------- */
const LogoutButton = styled.button`
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 12px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: 0.25s ease;

  &:hover {
    background: rgba(239,68,68,0.28);
  }

  @media (max-width: 768px) {
    justify-content: center;
    gap: 0;
    span { display: none; }
  }
`;

const LoginButton = styled.button`
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid rgba(59,130,246,0.12);
  padding: 12px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: 0.15s ease;

  &:hover {
    background: rgba(59,130,246,0.06);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.04);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  z-index: 60;

  &:hover { background: rgba(255,255,255,0.08); }
`;

const VisuallyHidden = styled.h2`
  position: absolute !important;
  height: 1px; width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
`;

/* ---------------- COMPONENT ---------------- */
export default function Nav({
  collapsed = false,
  mobileOpen = false,
  isMobile = false,
  onCloseMobile = () => {}
}) {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;

  const nav = useNavigate();
  const { pathname } = useLocation();
  const isActive = (route) => pathname === route;

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    logout();
    nav("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 48
          }}
        />
      )}

      <Sidebar $collapsed={collapsed} $mobileOpen={mobileOpen}>
        <AppTitle>
          <span className="brand-short">BE</span>
          <span className="full">BuildERP</span>
        </AppTitle>

        {isMobile && mobileOpen && (
          <CloseButton onClick={onCloseMobile}>✕</CloseButton>
        )}

        <VisuallyHidden>Navigation Menu</VisuallyHidden>

        {/* MAIN */}
        <SectionTitle>Main</SectionTitle>

        <NavItem to="/dashboard" $active={isActive("/dashboard")} $collapsed={collapsed}>
          <LayoutDashboard size={18} />
          <span className="label">Dashboard</span>
        </NavItem>

        <NavItem to="/projects" $active={isActive("/projects")} $collapsed={collapsed}>
          <FolderKanban size={18} />
          <span className="label">Projects</span>
        </NavItem>

        {/* FINANCE */}
        <SectionTitle>Finance</SectionTitle>

        <NavItem to="/ledger" $active={isActive("/ledger")} $collapsed={collapsed}>
          <BookOpen size={18} />
          <span className="label">General Ledger</span>
        </NavItem>

        <NavItem to="/invoices" $active={isActive("/invoices")} $collapsed={collapsed}>
          <Receipt size={18} />
          <span className="label">Invoices</span>
        </NavItem>

        <NavItem to="/vendors" $active={isActive("/vendors")} $collapsed={collapsed}>
          <Store size={18} />
          <span className="label">Vendors</span>
        </NavItem>

        <NavItem to="/customers" $active={isActive("/customers")} $collapsed={collapsed}>
          <UserCircle size={18} />
          <span className="label">Customers</span>
        </NavItem>

        <NavItem to="/payments" $active={isActive("/payments")} $collapsed={collapsed}>
          <DollarSign size={18} />
          <span className="label">Payments</span>
        </NavItem>

        <NavItem to="/exchange" $active={isActive("/exchange")} $collapsed={collapsed}>
          <Landmark size={18} />
          <span className="label">Exchange Rates</span>
        </NavItem>

        {/* ANALYTICS */}
        <SectionTitle>Analytics</SectionTitle>

        <NavItem to="/risk" $active={isActive("/risk")} $collapsed={collapsed}>
          <ShieldAlert size={18} />
          <span className="label">Risk</span>
        </NavItem>

        <NavItem to="/insights" $active={isActive("/insights")} $collapsed={collapsed}>
          <BarChart3 size={18} />
          <span className="label">AI Insights</span>
        </NavItem>

        {/* ADMIN */}
        <SectionTitle>Administration</SectionTitle>

        <NavItem to="/users" $active={isActive("/users")} $collapsed={collapsed}>
          <Users size={18} />
          <span className="label">Users</span>
        </NavItem>

        <NavItem to="/audit" $active={isActive("/audit")} $collapsed={collapsed}>
          <FileClock size={18} />
          <span className="label">Audit Logs</span>
        </NavItem>

        {/* AUTH BUTTONS */}
        {isAuthenticated ? (
          <LogoutButton onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </LogoutButton>
        ) : (
          <LoginButton onClick={() => nav("/login")}>
            <UserCircle size={18} />
            <span>Login</span>
          </LoginButton>
        )}
      </Sidebar>
    </>
  );
}
