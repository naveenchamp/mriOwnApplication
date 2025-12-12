import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import styled from "styled-components";
import api from "../services/api"; // axios instance (baseURL set)

// -------------------- Styled Layout --------------------
const Page = styled.div`
  padding: 40px;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.body};
  color: ${({ theme }) => theme.colors.text};
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  margin: 0;
`;

const Subtitle = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 6px;
`;

const Flex = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const ActionButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  gap: 8px;
  align-items: center;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 22px;
`;

const PageGrid = styled.div`
  display: grid;
  gap: 22px;
  grid-template-columns: 1fr 1fr;
  margin-top: 18px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

// -------------------- Accounts Tree --------------------
const AccountsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AccountGroup = styled.div`
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const GroupHeader = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GroupBody = styled.div`
  background: ${({ theme }) => theme.colors.body};
  padding: 8px 0;
`;

const AccountRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  &:hover {
    background: rgba(255,255,255,0.03);
  }
`;

// -------------------- Journal Table --------------------
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  text-align: left;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 12px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

// -------------------- Modal --------------------
const ModalBg = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3,7,18,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 120;
`;

const Modal = styled.div`
  width: 420px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  padding: 18px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.body};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.body};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
`;

const FieldLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 6px;
`;

const Empty = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  padding: 30px;
  text-align: center;
`;

// -------------------- Helpers --------------------
function formatCurrency(value) {
  const num = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

// -------------------- MAIN COMPONENT --------------------
export default function GeneralLedger() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    code: "",
    name: "",
    type: "asset",
    currency: "INR",
  });

  // -------------------- FETCH ACCOUNTS --------------------
  const {
    data: accounts = [],
    isLoading: accountsLoading,
    refetch: refetchAccounts,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await api.get("/api/accounts"); // FIXED
      return res.data;
    },
  });

  // -------------------- FETCH JOURNAL ENTRIES --------------------
  const {
    data: entries = [],
    isLoading: entriesLoading,
  } = useQuery({
    queryKey: ["journal-entries"],
    queryFn: async () => {
      const res = await api.get("/api/journal-entries"); // FIXED
      return res.data;
    },
  });

  // -------------------- CREATE ACCOUNT --------------------
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/api/accounts", payload); // FIXED
      return res.data;
    },
    onSuccess: () => {
      refetchAccounts();
      setIsModalOpen(false);
      setForm({ code: "", name: "", type: "asset", currency: "INR" });
    },
  });

  const grouped = useMemo(() => {
    const g = {};
    accounts.forEach((a) => {
      const type = (a.type || "asset").toLowerCase();
      if (!g[type]) g[type] = [];
      g[type].push(a);
    });
    return g;
  }, [accounts]);

  const handleCreate = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      return alert("Enter account code & name");
    }
    setCreating(true);
    try {
      await createMutation.mutateAsync(form);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create account");
    } finally {
      setCreating(false);
    }
  };

  // -------------------- UI --------------------
  return (
    <Page>
      <HeaderRow>
        <div>
          <Title>General Ledger</Title>
          <Subtitle>Chart of accounts and journal entries</Subtitle>
        </div>

        <Flex>
          <ActionButton onClick={() => setIsModalOpen(true)}>
            + New Account
          </ActionButton>
        </Flex>
      </HeaderRow>

      <PageGrid>
        {/* ACCOUNTS SECTION */}
        <div>
          <Card>
            <h3>Chart of Accounts</h3>

            {accountsLoading ? (
              <Empty>Loading accounts…</Empty>
            ) : accounts.length === 0 ? (
              <Empty>No accounts yet — create one.</Empty>
            ) : (
              <AccountsWrapper>
                {["asset", "liability", "equity", "revenue", "expense"].map(
                  (type) => {
                    const list = grouped[type] || [];
                    if (!list.length) return null;
                    const total = list.reduce(
                      (s, a) => s + Number(a.balance || 0),
                      0
                    );
                    return (
                      <AccountGroup key={type}>
                        <GroupHeader>
                          <div style={{ textTransform: "capitalize", fontWeight: 700 }}>
                            {type} ({list.length})
                          </div>
                          <div style={{ fontFamily: "monospace" }}>
                            {formatCurrency(total)}
                          </div>
                        </GroupHeader>

                        <GroupBody>
                          {list.map((a) => (
                            <AccountRow key={a.id}>
                              <div style={{ display: "flex", gap: 12 }}>
                                <span style={{ fontFamily: "monospace", color: "#9aa7bd" }}>
                                  {a.code}
                                </span>
                                <span>{a.name}</span>
                              </div>
                              <span style={{ fontFamily: "monospace" }}>
                                {formatCurrency(a.balance)}
                              </span>
                            </AccountRow>
                          ))}
                        </GroupBody>
                      </AccountGroup>
                    );
                  }
                )}
              </AccountsWrapper>
            )}
          </Card>
        </div>

        {/* JOURNAL ENTRIES SECTION */}
        <div>
          <Card>
            <h3>Journal Entries</h3>

            {entriesLoading ? (
              <Empty>Loading journal entries…</Empty>
            ) : entries.length === 0 ? (
              <Empty>No journal entries yet.</Empty>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Entry #</Th>
                    <Th>Date</Th>
                    <Th>Description</Th>
                    <Th>Status</Th>
                    <Th style={{ textAlign: "right" }}>Debit</Th>
                    <Th style={{ textAlign: "right" }}>Credit</Th>
                  </tr>
                </thead>

                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id}>
                      <Td style={{ fontFamily: "monospace" }}>
                        {e.entryNumber || `JE-${e.id}`}
                      </Td>
                      <Td>
                        {e.date
                          ? new Date(e.date).toLocaleDateString()
                          : "-"}
                      </Td>
                      <Td
                        style={{
                          maxWidth: 260,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {e.description || "-"}
                      </Td>
                      <Td style={{ textTransform: "capitalize" }}>
                        {e.status || "pending"}
                      </Td>
                      <Td style={{ textAlign: "right", fontFamily: "monospace" }}>
                        {formatCurrency(e.totalDebit)}
                      </Td>
                      <Td style={{ textAlign: "right", fontFamily: "monospace" }}>
                        {formatCurrency(e.totalCredit)}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </div>
      </PageGrid>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <ModalBg onClick={() => setIsModalOpen(false)}>
          <Modal onClick={(ev) => ev.stopPropagation()}>
            <h3>Create New Account</h3>

            <FieldLabel>Account Code</FieldLabel>
            <Input
              value={form.code}
              onChange={(e) =>
                setForm((s) => ({ ...s, code: e.target.value }))
              }
              placeholder="e.g., 1000"
            />

            <FieldLabel>Account Name</FieldLabel>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm((s) => ({ ...s, name: e.target.value }))
              }
              placeholder="e.g., Cash"
            />

            <FieldLabel>Account Type</FieldLabel>
            <Select
              value={form.type}
              onChange={(e) =>
                setForm((s) => ({ ...s, type: e.target.value }))
              }
            >
              <option value="asset">Asset</option>
              <option value="liability">Liability</option>
              <option value="equity">Equity</option>
              <option value="revenue">Revenue</option>
              <option value="expense">Expense</option>
            </Select>

            <FieldLabel>Currency</FieldLabel>
            <Select
              value={form.currency}
              onChange={(e) =>
                setForm((s) => ({ ...s, currency: e.target.value }))
              }
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </Select>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <ActionButton
                style={{ background: "transparent", color: "#9aa7bd" }}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </ActionButton>

              <ActionButton onClick={handleCreate} disabled={creating}>
                {creating ? "Creating..." : "Create Account"}
              </ActionButton>
            </div>
          </Modal>
        </ModalBg>
      )}
    </Page>
  );
}
