import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { Receipt, CreditCard, Banknote, Building } from "lucide-react";

// ---------------- Styled Components ----------------
const Page = styled.div`
  padding: 40px;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.body};
  color: ${({ theme }) => theme.colors.text};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 22px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  margin: 0;
  margin-bottom: 6px;
`;

const CardDesc = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 14px;
`;

const SummaryGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const Empty = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  padding: 40px;
  text-align: center;
`;

// ---------------- Helper Functions ----------------
function formatCurrency(v) {
  const n = Number(v || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(n);
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PaymentMethodIcon({ method }) {
  switch (method) {
    case "credit_card": return <CreditCard size={16} />;
    case "bank_transfer": return <Building size={16} />;
    case "cash": return <Banknote size={16} />;
    default: return <Receipt size={16} />;
  }
}

// ---------------- Main Component ----------------
export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/payments");
      setPayments(res.data || []);
    } catch (err) {
      console.error("Failed to load payments", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const totalPayments = payments.reduce((s, p) => s + Number(p.amount || 0), 0);

  return (
    <Page>
      <h1>Payments</h1>
      <div style={{ color: "#9aa7bd" }}>Track all payment transactions</div>

      {/* ---------- SUMMARY CARDS ---------- */}
      <SummaryGrid>
        <Card>
          <CardTitle>Total Payments</CardTitle>
          <CardDesc>All recorded transactions</CardDesc>
          <div style={{ fontFamily: "monospace", fontSize: 24, fontWeight: 600 }}>
            {formatCurrency(totalPayments)}
          </div>
          <div style={{ color: "#9aa7bd" }}>{payments.length} transactions</div>
        </Card>

        <Card>
          <CardTitle>Bank Transfers</CardTitle>
          <CardDesc>Payments via bank</CardDesc>
          <div style={{ fontFamily: "monospace", fontSize: 24 }}>
            {payments.filter(p => p.paymentMethod === "bank_transfer").length}
          </div>
        </Card>

        <Card>
          <CardTitle>Card Payments</CardTitle>
          <CardDesc>Payments via cards</CardDesc>
          <div style={{ fontFamily: "monospace", fontSize: 24 }}>
            {payments.filter(p => p.paymentMethod === "credit_card").length}
          </div>
        </Card>
      </SummaryGrid>

      {/* ---------- PAYMENT HISTORY TABLE ---------- */}
      <Card>
        <CardTitle>Payment History</CardTitle>
        <CardDesc>All transactions recorded</CardDesc>

        {loading ? (
          <Empty>Loading payments…</Empty>
        ) : payments.length === 0 ? (
          <Empty>No payments recorded</Empty>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice</th>
                <th>Method</th>
                <th>Reference</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{formatDate(p.paymentDate)}</td>
                  <td>INV-{p.invoiceId}</td>
                  <td style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <PaymentMethodIcon method={p.paymentMethod} />
                    <span>{p.paymentMethod?.replace("_", " ")}</span>
                  </td>
                  <td style={{ color: "#9aa7bd" }}>{p.reference || "-"}</td>
                  <td style={{ textAlign: "right", fontFamily: "monospace" }}>
                    {formatCurrency(p.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Page>
  );
}
