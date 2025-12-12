import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";

// ---------------------- Layout ----------------------
const Page = styled.div`
  padding: 40px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.body};
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
`;

const SubTitle = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 30px;
`;

// Grid for KPI + charts
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 20px;
`;

// Cards
const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 22px;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  transition: 0.25s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 18px rgba(0,0,0,0.2);
  }
`;

const CardLabel = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 6px;
`;

const CardValue = styled.div`
  font-size: 32px;
  font-weight: 700;
`;

const ChartCard = styled(Card)`
  height: 340px;
`;

// ---------------------- Component ----------------------
export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const projectsCount = projects.length;
  const totalSpent = projects.reduce((sum, p) => sum + Number(p.spent || 0), 0);
  const pendingInvoices = invoices.filter((i) => i.status !== "Paid").length;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [p, inv] = await Promise.all([
        api.get("/projects"),
        api.get("/invoices"),
      ]);

      setProjects(p.data || []);
      setInvoices(inv.data || []);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }

  // ---------------------- Charts Data ----------------------
  const cashFlowData = [
    {
      id: "Income",
      color: "#22c55e",
      data: [
        { x: "Jul", y: 65000 },
        { x: "Aug", y: 60000 },
        { x: "Sep", y: 67000 },
        { x: "Oct", y: 58000 },
        { x: "Nov", y: 62000 },
        { x: "Dec", y: 70000 },
      ],
    },
    {
      id: "Expenses",
      color: "#f87171",
      data: [
        { x: "Jul", y: 42000 },
        { x: "Aug", y: 30000 },
        { x: "Sep", y: 45000 },
        { x: "Oct", y: 40000 },
        { x: "Nov", y: 48000 },
        { x: "Dec", y: 35000 },
      ],
    },
  ];

  const budgetvsProgress = [
    { project: "A", budget: 80, progress: 50 },
    { project: "B", budget: 60, progress: 40 },
    { project: "C", budget: 95, progress: 70 },
    { project: "D", budget: 70, progress: 55 },
  ];

  // ---------------------- Loading State ----------------------
  if (loading) {
    return (
      <Page>
        <Title>Dashboard</Title>
        <SubTitle>Loading dashboard data…</SubTitle>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Dashboard</Title>
      <SubTitle>Overview of your construction business</SubTitle>

      {/* KPIs */}
      <Grid>
        <Card>
          <CardLabel>Total Spent (All Projects)</CardLabel>
          <CardValue>₹{totalSpent.toLocaleString()}</CardValue>
        </Card>

        <Card>
          <CardLabel>Active Projects</CardLabel>
          <CardValue>{projectsCount}</CardValue>
        </Card>

        <Card>
          <CardLabel>Pending Invoices</CardLabel>
          <CardValue>{pendingInvoices}</CardValue>
        </Card>

        <Card>
          <CardLabel>Risk Alerts</CardLabel>
          <CardValue>0</CardValue>
        </Card>
      </Grid>

      <div style={{ height: 20 }} />

      {/* Charts */}
      <Grid>
        <ChartCard>
          <h3 style={{ marginBottom: 10 }}>Cash Flow Trend</h3>
          <ResponsiveLine
            data={cashFlowData}
            margin={{ top: 40, right: 40, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: "auto", max: "auto" }}
            colors={(d) => d.color}
            curve="monotoneX"
            pointSize={8}
            useMesh={true}
          />
        </ChartCard>

        <ChartCard>
          <h3 style={{ marginBottom: 10 }}>Budget vs Progress</h3>
          <ResponsiveBar
            data={budgetvsProgress}
            keys={["budget", "progress"]}
            indexBy="project"
            padding={0.3}
            colors={["#60a5fa", "#a78bfa"]}
            margin={{ top: 20, right: 30, bottom: 40, left: 50 }}
          />
        </ChartCard>
      </Grid>

      <div style={{ height: 20 }} />

      {/* Project Risk + Alerts */}
      <Grid>
        <Card style={{ height: 200 }}>
          <h3>Project Risk Assessment</h3>
          <p style={{ color: "#9ca3af" }}>AI-powered risk analysis (coming soon)</p>
          <div style={{ marginTop: 20, color: "#9ca3af" }}>
            No projects to analyze yet
          </div>
        </Card>

        <Card style={{ height: 200 }}>
          <h3>Recent Alerts</h3>
          <p style={{ color: "#9ca3af" }}>Important notifications</p>
          <div style={{ marginTop: 20, color: "#9ca3af" }}>
            No alerts at this time
          </div>
        </Card>
      </Grid>
    </Page>
  );
}
