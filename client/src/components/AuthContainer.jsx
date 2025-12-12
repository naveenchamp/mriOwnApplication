import styled from "styled-components";
import { motion } from "framer-motion";

export const AuthWrapper = styled.div`
  margin-left: 0; /* auth pages ignore sidebar */
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  background: ${({ theme }) => theme.authBackground || `linear-gradient(135deg, ${theme.colors.bg} 0%, ${theme.colors.sidebar} 100%)`};
  padding: 24px;
`;

export const AuthCard = styled(motion.div)`
  width: 420px;
  padding: 36px;
  background: ${({ theme }) => theme.colors.cardGlass || "rgba(255,255,255,0.04)"};
  backdrop-filter: blur(8px);
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 8px 22px rgba(0,0,0,0.25);
  transition: 0.25s ease;

  @media (max-width: 520px) {
    width: 100%;
    padding: 20px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 26px rgba(0,0,0,0.35);
  }

  @media (max-width: 520px) {
    &:hover { transform: none; box-shadow: none; }
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 13px 14px;
  margin-bottom: 14px;
  font-size: 15px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBG || "rgba(255,255,255,0.06)"};
  color: ${({ theme }) => theme.colors.text};
  transition: 0.25s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.inputFocusBG || "rgba(255,255,255,0.12)"};
    box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 13px;
  margin-top: 8px;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: 0.25s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover || "#1e40af"};
    transform: translateY(-2px);
  }

  &:active { transform: scale(0.98); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

export const SwitchText = styled.p`
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    transition: 0.2s;
    &:hover { text-decoration: underline; }
  }
`;

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error || "#ef4444"};
  text-align: center;
  margin-top: 12px;
  font-weight: 600;
`;

export const SuccessText = styled.p`
  color: ${({ theme }) => theme.colors.success || "#22c55e"};
  text-align: center;
  margin-top: 12px;
  font-weight: 600;
`;
