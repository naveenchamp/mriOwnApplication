import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { Page, Title, SubTitle } from "../components/PageLayout";
import { Plus, ArrowRight } from "lucide-react";

// ---------- STYLES ----------
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

  &:hover {
    opacity: 0.9;
  }
`;

const Table = styled.table`
  width: 100%;
  margin-top: 16px;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
  }
`;

const ModalBg = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  width: 420px;
  background: ${({ theme }) => theme.colors.card};
  padding: 24px;
  border-radius: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
`;

// ---------- CURRENCIES ----------
const currencies = [
  "USD", "EUR", "GBP", "CAD", "AUD",
  "JPY", "CHF", "CNY", "INR", "MXN"
];

// ---------- MAIN COMPONENT ----------
export default function Exchange() {
  const [rates, setRates] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    fromCurrency: "USD",
    toCurrency: "",
    rate: "",
    effectiveDate: new Date().toISOString().split("T")[0],
  });

  // --- Load Exchange Rates ---
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

  // --- Submit New Exchange Rate ---
  const submit = async () => {
    // Prevent invalid pair
    if (form.fromCurrency === form.toCurrency) {
      alert("From and To currency cannot be the same!");
      return;
    }

    // Prevent empty fields
    if (!form.toCurrency || !form.rate) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        ...form,
        rate: String(form.rate), // backend needs string
      };

      await api.post("/exchange", payload);

      setOpen(false);
      loadRates();
    } catch (err) {
      console.error("ADD RATE ERROR:", err.response?.data || err.message);
      alert("Failed to add exchange rate");
    }
  };

  return (
    <Page>
      <Title>Exchange Rates</Title>
      <SubTitle>Manage currency exchange conversions</SubTitle>

      <Button onClick={() => setOpen(true)}>
        <Plus size={16} /> Add Rate
      </Button>

      {/* Exchange Rates Table */}
      <Card>
        {rates.length === 0 ? (
          <p style={{ color: "#9aa7bd" }}>No exchange rates found.</p>
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
                  <td>{parseFloat(r.rate).toFixed(6)}</td>
                  <td>{new Date(r.effectiveDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* Modal */}
      {open && (
        <ModalBg onClick={() => setOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h3>Add Exchange Rate</h3>

            <label>From Currency</label>
            <select
              value={form.fromCurrency}
              onChange={(e) =>
                setForm({ ...form, fromCurrency: e.target.value })
              }
              style={{ marginBottom: 12, padding: 10, borderRadius: 8 }}
            >
              {currencies.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <label>To Currency</label>
            <select
              value={form.toCurrency}
              onChange={(e) =>
                setForm({ ...form, toCurrency: e.target.value })
              }
              style={{ marginBottom: 12, padding: 10, borderRadius: 8 }}
            >
              <option value="">Select</option>
              {currencies.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <Input
              type="number"
              placeholder="Rate"
              value={form.rate}
              onChange={(e) => setForm({ ...form, rate: e.target.value })}
            />

            <Input
              type="date"
              value={form.effectiveDate}
              onChange={(e) =>
                setForm({ ...form, effectiveDate: e.target.value })
              }
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit}>Add Rate</Button>
            </div>
          </Modal>
        </ModalBg>
      )}
    </Page>
  );
}
