import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { Page, Title, SubTitle } from "../components/PageLayout";
import { Plus, ArrowRight } from "lucide-react";

/* ------------------ STYLES ------------------ */

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 22px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;

  &:hover {
    opacity: 0.9;
  }
`;

const Table = styled.table`
  width: 100%;
  margin-top: 16px;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
  }
`;

const ModalBg = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const Modal = styled.div`
  width: 420px;
  background: ${({ theme }) => theme.colors.card};
  padding: 24px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  animation: fadeIn 0.25s ease;

  @media (max-width: 480px) {
    width: 90%;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
`;

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
  padding: 20px;
`;

/* ------------------ CURRENCY LIST ------------------ */
const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "CNY", "INR", "MXN"];

/* ------------------ MAIN COMPONENT ------------------ */

export default function Exchange() {
  const [rates, setRates] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    fromCurrency: "USD",
    toCurrency: "",
    rate: "",
    effectiveDate: new Date().toISOString().split("T")[0],
  });

  /* Load list */
  const loadRates = async () => {
    try {
      const res = await api.get("/exchange");
      setRates(res.data || []);
    } catch (err) {
      console.error("Failed to load exchange rates", err);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  /* Submit handler */
  const submit = async () => {
    if (form.fromCurrency === form.toCurrency) {
      alert("From and To currency cannot be the same.");
      return;
    }

    if (!form.rate || isNaN(parseFloat(form.rate))) {
      alert("Please enter a valid number for rate.");
      return;
    }

    if (!form.toCurrency) {
      alert("Please select a target currency.");
      return;
    }

    try {
      await api.post("/exchange", {
        ...form,
        rate: String(form.rate),
      });

      setOpen(false);
      loadRates();
    } catch (err) {
      console.error("ADD RATE ERROR:", err.response?.data || err.message);
      alert("Failed to add exchange rate.");
    }
  };

  return (
    <Page>
      <Title>Exchange Rates</Title>
      <SubTitle>Manage currency conversion rates</SubTitle>

      <Button onClick={() => setOpen(true)}>
        <Plus size={16} /> Add Rate
      </Button>

      <Card>
        {rates.length === 0 ? (
          <EmptyText>No exchange rates found.</EmptyText>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Currency Pair</th>
                <th>Rate</th>
                <th>Effective Date</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.fromCurrency}</strong>
                    <ArrowRight size={16} style={{ margin: "0 6px" }} />
                    <strong>{r.toCurrency}</strong>
                  </td>
                  <td>{Number(r.rate).toFixed(6)}</td>
                  <td>{new Date(r.effectiveDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* -------- Modal -------- */}
      {open && (
        <ModalBg onClick={() => setOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 16 }}>Add Exchange Rate</h3>

            <Label>From Currency</Label>
            <StyledSelect
              value={form.fromCurrency}
              onChange={(e) => setForm({ ...form, fromCurrency: e.target.value })}
            >
              {currencies.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </StyledSelect>

            <Label>To Currency</Label>
            <StyledSelect
              value={form.toCurrency}
              onChange={(e) => setForm({ ...form, toCurrency: e.target.value })}
            >
              <option value="">Select</option>
              {currencies.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </StyledSelect>

            <Label>Rate</Label>
            <Input
              type="number"
              placeholder="Rate"
              value={form.rate}
              onChange={(e) => setForm({ ...form, rate: e.target.value })}
            />

            <Label>Effective Date</Label>
            <Input
              type="date"
              value={form.effectiveDate}
              onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit}>Add Rate</Button>
            </div>
          </Modal>
        </ModalBg>
      )}
    </Page>
  );
}
