// src/pages/Customers.jsx
import React, { useEffect, useState } from "react";
import { Page, Title, SubTitle } from "../components/PageLayout";
import api from "../services/api";
import styled from "styled-components";

const Row = styled.div`
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 10px;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Email = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Load Customers
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await api.get("/customers");
        if (mounted) {
          const list = res.data || [];
          setCustomers(list);
          setFiltered(list);
        }
      } catch (e) {
        if (mounted) setError("Failed to load customers");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  // Search Filter
  useEffect(() => {
    if (!search.trim()) return setFiltered(customers);

    const q = search.toLowerCase();
    const result = customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    );

    setFiltered(result);
  }, [search, customers]);

  return (
    <Page>
      <Title>Customers</Title>
      <SubTitle>Clients & contacts</SubTitle>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search customers by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Loading State */}
      {loading && <div style={{ color: "#9aa7bd" }}>Loading customers…</div>}

      {/* Error State */}
      {error && <div style={{ color: "#ef4444" }}>{error}</div>}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ color: "#9aa7bd", marginTop: 20 }}>
          No matching customers.
        </div>
      )}

      {/* List */}
      {filtered.map((c) => (
        <Row key={c.id}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>{c.name}</div>
            <Email>{c.email || "—"}</Email>
          </div>

          {/* Future: Actions */}
          {/* <Actions>edit / delete here</Actions> */}
        </Row>
      ))}
    </Page>
  );
}
