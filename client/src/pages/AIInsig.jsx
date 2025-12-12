// src/pages/AIInsig.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";

// ---------------------- Layout ----------------------
const Page = styled.div`
  padding: 40px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.body};
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 6px;
`;

const Sub = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 20px;
`;

// ---------------------- KPI Cards ----------------------
const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 26px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const KPI = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 18px;
  border-radius: 12px;
  text-align: center;
`;

const KLabel = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 13px;
`;

const KVal = styled.div`
  font-size: 26px;
  font-weight: 700;
  margin-top: 6px;
`;

// ---------------------- Charts ----------------------
const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 18px;
  margin-bottom: 26px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ChartBox = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  border-radius: 12px;
  min-height: 240px;
`;

// ---------------------- Sparkline ----------------------
function Sparkline({ values }) {
  if (!values?.length) return null;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / (max - min || 1)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: 100 }}>
      <polyline fill="none" stroke="#3b82f6" strokeWidth="3" points={pts} strokeLinecap="round" />
    </svg>
  );
}

// ---------------------- Component ----------------------
export default function AIInsig() {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState({});
  const [risks, setRisks] = useState([]);
  const [cashValues, setCashValues] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [h, r, c] = await Promise.all([
          api.get("/insights/health"),
          api.get("/insights/risks"),
          api.get("/insights/cashflow"),
        ]);

        setHealth(h.data || {});
        setRisks(Array.isArray(r.data) ? r.data : []);
        setCashValues((c.data || []).map((x) => Number(x.value) || 0));
      } catch (err) {
        console.error("INSIGHT ERROR:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Page>
        <Title>AI Insights</Title>
        <Sub>Loading Insights…</Sub>
      </Page>
    );
  }

  return (
    <Page>
      <Title>AI Insights</Title>
      <Sub>AI-powered analytics & risk predictions</Sub>

      {/* KPI Metrics */}
      <KPIGrid>
        <KPI><KLabel>Total Projects</KLabel><KVal>{health.totalProjects || 0}</KVal></KPI>
        <KPI><KLabel>Healthy</KLabel><KVal>{health.healthy || 0}</KVal></KPI>
        <KPI><KLabel>At Risk</KLabel><KVal>{health.atRisk || 0}</KVal></KPI>
        <KPI><KLabel>Critical</KLabel><KVal>{health.critical || 0}</KVal></KPI>
      </KPIGrid>

      {/* Charts */}
      <ChartsRow>
        <ChartBox>
          <h3>Projected Cash Flow</h3>
          <Sparkline values={cashValues} />
          <p style={{ color: "#9aa7bd", marginTop: 8 }}>
            Forecast generated from historical trend analysis.
          </p>
        </ChartBox>

        <ChartBox>
          <h3>Portfolio Health</h3>
          <p>Avg Progress: <strong>{health.averageProgress || 0}%</strong></p>
          <p>Avg Budget Usage: <strong>{health.averageBudgetUsage || 0}%</strong></p>

          <div style={{ height: 12, background: "#111", borderRadius: 8, marginTop: 12 }}>
            <div style={{
              width: `${health.averageBudgetUsage || 0}%`,
              height: "100%",
              background: "#a78bfa",
              borderRadius: 8,
            }}></div>
          </div>
        </ChartBox>
      </ChartsRow>

      {/* Risk Table */}
      <ChartBox>
        <h3>Project Risk Overview</h3>

        {risks.length === 0 ? (
          <p style={{ color: "#9aa7bd" }}>No project risk data.</p>
        ) : (
          <table style={{ width: "100%", marginTop: 12 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#9aa7bd" }}>
                <th>Project</th>
                <th>Progress</th>
                <th>Budget Usage</th>
                <th>Risk Level</th>
              </tr>
            </thead>

            <tbody>
              {risks.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.progress || 0}%</td>
                  <td>{r.budgetUsage || 0}%</td>
                  <td
                    style={{
                      color:
                        r.riskLevel === "Critical"
                          ? "#ef4444"
                          : r.riskLevel === "High"
                          ? "#f97316"
                          : r.riskLevel === "Medium"
                          ? "#eab308"
                          : "#22c55e",
                    }}
                  >
                    {r.riskLevel || "Low"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ChartBox>
    </Page>
  );
}
