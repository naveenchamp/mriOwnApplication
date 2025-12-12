import React from "react";
import styled from "styled-components";

const Fallback = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.bg};
  padding: 24px;
  text-align: center;
`;

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // log to external service if needed
    // console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Fallback role="alert">
          <h2>Something went wrong</h2>
          <p>We're sorry — an unexpected error occurred. Try reloading the page.</p>
          <div>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "none",
                background: "#2563eb",
                color: "white",
                cursor: "pointer",
              }}
            >
              Reload
            </button>
          </div>
        </Fallback>
      );
    }

    return this.props.children;
  }
}
