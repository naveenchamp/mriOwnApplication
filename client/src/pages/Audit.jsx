// src/pages/Audit.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";

// ---------------------- Layout ----------------------
const Page = styled.div`
  padding: 40px;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.body};
  color: ${({ theme }) => theme.colors.text};
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 6px;
`;

const SubTitle = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  overflow-x: auto;
  max-height: calc(100vh - 160px);
`;

// ---------------------- Table ----------------------
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  min-width: 900px;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Td = styled.td`
  padding: 10px 8px;
  font-size: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: top;
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  color: white;

  background: ${({ type }) =>
    type === "CREATE"
      ? "#3b82f6"
      : type === "UPDATE"
      ? "#eab308"
      : type === "DELETE"
      ? "#ef4444"
      : "#6b7280"};
`;

const Loading = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 20px;
  font-size: 16px;
`;

// ---------------------- Component ----------------------
export default function Audit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await api.get("/audit");
        setLogs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load audit logs:", err);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const prettyJSON = (val) => {
    if (!val) return "—";
    try {
      const obj = typeof val === "string" ? JSON.parse(val) : val;
      return JSON.stringify(obj, null, 2);
    } catch {
      return val;
    }
  };

  return (
    <Page>
      <Title>Audit Logs</Title>
      <SubTitle>System events, changes & user actions tracked automatically</SubTitle>

      <Card>
        {loading ? (
          <Loading>Loading logs…</Loading>
        ) : logs.length === 0 ? (
          <Loading>No audit events recorded yet.</Loading>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Timestamp</Th>
                <Th>User</Th>
                <Th>Action</Th>
                <Th>Entity</Th>
                <Th>Details</Th>
                <Th>IP</Th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id || `${log.userId}-${log.action}-${log.createdAt}`}>
                  <Td>{formatDate(log.createdAt)}</Td>

                  <Td>{log.userId || "—"}</Td>

                  <Td>
                    <Badge type={(log.action || "").split("_")[0]}>
                      {log.action || "—"}
                    </Badge>
                  </Td>

                  <Td>
                    {log.entityType ? (
                      <>
                        {log.entityType} #{log.entityId}
                      </>
                    ) : (
                      "—"
                    )}
                  </Td>

                  <Td>
                    <pre
                      style={{
                        background: "#0f172a",
                        color: "#cbd5e1",
                        padding: "8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        maxWidth: "340px",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {prettyJSON(log.newValues)}
                    </pre>
                  </Td>

                  <Td>{log.ipAddress || "—"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Page>
  );
}
