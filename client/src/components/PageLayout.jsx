// src/components/PageLayout.jsx
import styled from "styled-components";

export const Page = styled.div`
  padding: 40px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.body};
  min-height: 100vh;
  height: 100%;
  width: 100%;
  overflow: visible;
  transition: margin-left 220ms ease;

  @media (max-width: 768px) {
    padding: 20px;
    margin-left: 0;
  }
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 6px;
`;

export const SubTitle = styled.div`
  font-size: 15px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.textLight};
`;

export default {
  Page,
  Title,
  SubTitle,
};
