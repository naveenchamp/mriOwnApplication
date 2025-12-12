import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* ---------- PAGE LAYOUT ---------- */
const Page = styled.div`
  padding: 40px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.body};
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 6px;
`;

const SubTitle = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 30px;
  font-size: 15px;
`;

/* ---------- FORM CARD ---------- */
const FormCard = styled(motion.div)`
  width: 480px;
  max-width: calc(100% - 40px);
  background: ${({ theme }) => theme.colors.card};
  padding: 24px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 6px 18px rgba(0,0,0,0.1);
  margin-bottom: 35px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 18px;
    margin-bottom: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255,255,255,0.08);
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 4px;
  font-size: 16px;
  transition: 0.2s;

  &:hover {
    background: #1e40af;
    transform: translateY(-2px);
  }
`;

/* ---------- PROJECT CARD ---------- */
const ProjectCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.card};
  padding: 20px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);

  transition: 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 18px rgba(0,0,0,0.12);
  }
`;

const ProjectName = styled(Link)`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Label = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 4px;
`;


export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const create = async () => {
    if (!name || !budget) return alert("Enter project name & budget");

    try {
      await api.post("/projects", { name, budget });
      setName("");
      setBudget("");
      // re-fetch projects after creating
      try {
        const res = await api.get("/projects");
        setProjects(res.data || []);
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Page>
      <Title>Projects</Title>
      <SubTitle>Manage your construction & finance projects</SubTitle>

      {/* Create Project Form */}
      <FormCard
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, type: "spring" }}
      >
        <Input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Budget (₹)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <Button onClick={create}>Create Project</Button>
      </FormCard>

      {/* Project List */}
      <div>
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ProjectName to={`/projects/${p.id}`}>{p.name}</ProjectName>

            <Label>Budget: ₹{p.budget}</Label>
            <Label>Spent: ₹{p.spent}</Label>
          </ProjectCard>
        ))}
      </div>
    </Page>
  );
}
  