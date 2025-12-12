import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const nav = useNavigate();

  const goLogin = () => nav("/login");

  return (
    <Wrapper>
      <NavBar>
        <Brand>BuildERP</Brand>
        <SignIn onClick={goLogin}>Sign In</SignIn>
      </NavBar>

      <Hero>
        <Title>
          Construction ERP & Finance <Highlight>Made Simple</Highlight>
        </Title>
        <Tagline>
          Manage projects, track finances, and get AI-driven insights — all in one place.
        </Tagline>

        <Buttons>
          <PrimaryButton onClick={goLogin}>Get Started</PrimaryButton>
          <SecondaryButton>Learn More</SecondaryButton>
        </Buttons>
      </Hero>
    </Wrapper>
  );
}

/* ------------------ STYLES ------------------ */

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #0e1117;
  color: white;
  padding: 30px 60px;
`;

const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled.div`
  font-size: 24px;
  font-weight: 800;
`;

const SignIn = styled.button`
  background: #2563eb;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  color: #fff;
  cursor: pointer;
`;

const Hero = styled.div`
  margin-top: 140px;
  max-width: 680px;
`;

const Title = styled.h1`
  font-size: 42px;
  line-height: 1.3;
`;

const Highlight = styled.span`
  color: #3b82f6;
`;

const Tagline = styled.p`
  margin-top: 18px;
  font-size: 18px;
  opacity: 0.8;
`;

const Buttons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 26px;
`;

const PrimaryButton = styled.button`
  background: #3b82f6;
  padding: 12px 22px;
  border-radius: 10px;
  border: none;
  color: #fff;
  cursor: pointer;
`;

const SecondaryButton = styled.button`
  background: rgba(255,255,255,0.08);
  padding: 12px 22px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  cursor: pointer;
`;
