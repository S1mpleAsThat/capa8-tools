// src/routes/ProtectedRoute.jsx

import LoginPage from "../pages/LoginPage";

import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({
  children,
}) {
  const {
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {
    return (
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
          background:
            "#000000",
          color: "#ffffff",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color:
              "rgba(255,255,255,.7)",
          }}
        >
          Cargando...
        </p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return children;
}