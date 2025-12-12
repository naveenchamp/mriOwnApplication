import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";
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
  margin-bottom: 8px;
`;

const SubTitle = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 25px;
`;

/* ---------- FORM ---------- */
const Select = styled.select`
  width: 340px;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
  font-size: 15px;
`;

/* ---------- RISK PANEL ---------- */
const Panel = styled(motion.div)`
  width: 420px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 24px;
  margin-top: 10px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
`;

/* ---------- METRIC ROW ---------- */
const Row = styled.div`
  margin-top: 12px;
  font-size: 15px;
`;

/* ---------- RISK GAUGE ---------- */
const GaugeWrapper = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: center;
`;

const GaugeBar = styled.div`
  width: 100%;
  height: 16px;
  border-radius: 12px;
  background: #222;
  overflow: hidden;
`;

const GaugeFill = styled(motion.div)`
  height: 100%;
  border-radius: 12px;
  background: ${({ level }) =>
    level === "Low"
      ? "#16a34a"
      : level === "Medium"
      ? "#fbbf24"
      : level === "High"
      ? "#f97316"
      : "#ef4444"};
`;

/* ---------- AI Insight Bubble ---------- */
const Insight = styled(motion.div)`
  margin-top: 18px;
  padding: 14px;
  border-radius: 12px;
  background: rgba(255,255,255,0.06);
  border-left: 4px solid
    ${({ level }) =>
      level === "Low"
        ? "#16a34a"
        : level === "Medium"
        ? "#fbbf24"
        : level === "High"
        ? "#f97316"
        : "#ef4444"};
  font-size: 14px;
  line-height: 1.5;
`;

export default function Risk() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState("");
  const [risk, setRisk] = useState(null);

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

  const loadRisk = async (id) => {
    if (!id) return setRisk(null);
    try {
      const res = await api.get(`/risk/${id}`);
      setRisk(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Page>
      <Title>Risk Analysis</Title>
      <SubTitle>AI-powered project cost overrun detection</SubTitle>

      <Select
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value);
          loadRisk(e.target.value);
        }}
      >
        <option value="">Select project</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Select>

      {/* ---- RISK PANEL ---- */}
      {risk ? (
        <Panel
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, type: "spring" }}
        >
          <h2 style={{ marginBottom: 10 }}>{risk.project}</h2>

          <Row><strong>Budget:</strong> ₹{risk.budget}</Row>
          <Row><strong>Spent:</strong> ₹{risk.spent}</Row>
          <Row><strong>Usage:</strong> {risk.budgetUsedPercent}%</Row>
          <Row><strong>Risk Level:</strong> {risk.risk}</Row>

          {/* ---- GAUGE ---- */}
          <GaugeWrapper>
            <GaugeBar>
              <GaugeFill
                level={risk.risk}
                initial={{ width: 0 }}
                animate={{ width: `${risk.budgetUsedPercent}%` }}
                transition={{ duration: 1 }}
              />
            </GaugeBar>
          </GaugeWrapper>

          {/* ---- AI INSIGHT ---- */}
          <Insight
            level={risk.risk}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {risk.risk === "Low" &&
              "Project spending is healthy and within expected limits."}

            {risk.risk === "Medium" &&
              "Spending is rising. Monitor costs to avoid future overruns."}

            {risk.risk === "High" &&
              "The project is over budget. Immediate corrective actions recommended."}

            {risk.risk === "Critical" &&
              "Severe cost overrun detected. This project requires urgent intervention."}
          </Insight>
        </Panel>
      ) : (
        <div style={{ marginTop: 20, color: "#888" }}>
          Select a project to view risk insights.
        </div>
      )}
    </Page>
  );
}
  