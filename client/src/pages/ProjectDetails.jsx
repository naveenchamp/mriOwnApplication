import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import api from "../services/api";
import { motion } from "framer-motion";

/* ---------- LAYOUT ---------- */
const Page = styled.div`
  margin-left: 260px;
  padding: 40px;
  color: ${({ theme }) => theme.colors.text};
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const SubText = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 30px;
`;

/* ---------- METRICS ---------- */
const MetricsGrid = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 35px;
`;

const MetricCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 20px;
  min-width: 220px;

  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }
`;

const MetricLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 6px;
`;

const MetricValue = styled.div`
  font-size: 28px;
  font-weight: 700;
`;

/* ---------- INVOICE SECTION ---------- */
const SectionTitle = styled.h2`
  font-size: 22px;
  margin-top: 25px;
  margin-bottom: 15px;
`;

const InvoiceCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.card};
  padding: 18px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 12px;

  transition: 0.25s ease;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 18px rgba(0,0,0,0.18);
  }
`;

const Empty = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
  padding-top: 5px;
`;


export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [pRes, invRes] = await Promise.all([
          api.get("/projects"),
          api.get("/invoices"),
        ]);

        const found = pRes.data?.find((x) => String(x.id) === String(id));
        setProject(found || null);

        setInvoices(invRes.data?.filter((i) => String(i.project_id) === String(id)) || []);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [id]);

  if (!project) return <Page>Loading...</Page>;

  const remaining = Number(project.budget) - Number(project.spent);

  return (
    <Page>
      <Title>{project.name}</Title>
      <SubText>Project financial overview & invoices</SubText>

      {/* ---- METRIC CARDS ---- */}
      <MetricsGrid>
        <MetricCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <MetricLabel>Budget</MetricLabel>
          <MetricValue>₹{project.budget}</MetricValue>
        </MetricCard>

        <MetricCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <MetricLabel>Spent</MetricLabel>
          <MetricValue>₹{project.spent}</MetricValue>
        </MetricCard>

        <MetricCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <MetricLabel>Remaining</MetricLabel>
          <MetricValue>₹{remaining}</MetricValue>
        </MetricCard>
      </MetricsGrid>

      {/* ---- INVOICES ---- */}
      <SectionTitle>Invoices</SectionTitle>

      {invoices.length === 0 && <Empty>No invoices found</Empty>}

      {invoices.map((inv) => (
        <InvoiceCard
          key={inv.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div><strong>Amount:</strong> ₹{inv.amount}</div>
          <div><strong>Due Date:</strong> {inv.due_date}</div>
          <div><strong>Status:</strong> {inv.status}</div>
        </InvoiceCard>
      ))}
    </Page>
  );
}
  