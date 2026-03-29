import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  tipoRequerido?: number;
}

const ProtectedRoute = ({ children, tipoRequerido }: Props) => {

  const token = localStorage.getItem("token");
  const clienteJSON = localStorage.getItem("cliente");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (tipoRequerido !== undefined && clienteJSON) {
    try {
      const cliente = JSON.parse(clienteJSON);
      if (cliente.idTipoCli !== tipoRequerido) {
        return <Navigate to="/" replace />;
      }
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;