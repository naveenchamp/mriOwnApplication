// src/components/Topbar.jsx
import React from "react";
import styled from "styled-components";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Bar = styled.div`
  width: 100%;
  height: 64px;
  background: #111827;
  padding: 0 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #1f2937;
  position: sticky;
  top: 0;
  z-index: 40;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 17px;
  color: white;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const ToggleButton = styled.button`
  width: 40px;
  height: 40px;
  display: inline-flex;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  cursor: pointer;
  color: white;

  &:hover {
    background: rgba(255,255,255,0.1);
  }

  @media (max-width: 768px) {
    background: ${({ theme }) => theme.colors.primary};
    border: none;
    color: white;
  }
`;

const UserText = styled.div`
  color: #e5e7eb;
  font-size: 14px;
  margin-right: 12px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const AuthLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  font-size: 15px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default function Topbar({ toggleSidebar }) {
  const { user } = useAuth();

  const isAuthenticated = !!user;

  return (
    <Bar>
      <Left>
        <ToggleButton aria-label="Toggle sidebar" onClick={toggleSidebar}>
          <Menu size={18} />
        </ToggleButton>

        <Title>BuildERP</Title>
      </Left>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {isAuthenticated ? (
          <UserText>Hi, {user?.username || "User"}</UserText>
        ) : (
          <AuthLink to="/login">Login</AuthLink>
        )}
      </div>
    </Bar>
  );
}
