import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { Page, Title, SubTitle } from "../components/PageLayout";
import { UserCircle } from "lucide-react";

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 22px;
  border-radius: 12px;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;

  th,
  td {
    padding: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.body};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
`;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users"); // backend already expects /api/users because api has baseURL=/api
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      loadUsers();
    } catch (err) {
      alert("Failed to update role.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Page>
      <Title>Users</Title>
      <SubTitle>Manage users, roles & permissions</SubTitle>

      <Card>
        {loading ? (
          <p style={{ color: "#9aa7bd" }}>Loading users…</p>
        ) : users.length === 0 ? (
          <p style={{ color: "#9aa7bd" }}>No users found.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th width="150">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <UserCircle size={20} /> {u.name || "Unnamed User"}
                    </div>
                  </td>
                  <td>{u.email || "-"}</td>
                  <td>{u.role}</td>

                  <td>
                    <Select
                      value={u.role}
                      onChange={(e) => updateRole(u.id, e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="viewer">Viewer</option>
                    </Select>
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
