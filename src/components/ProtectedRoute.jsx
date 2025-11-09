import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

// Este componente vai "embrulhar" (proteger) nossas páginas.
// 'allowedRoles' é um array de papéis permitidos, ex: ['admin']
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation(); // Para saber de onde o usuário veio

  // 1. O usuário está logado?
  if (!isAuthenticated || !user) {
    // Se não estiver, mande-o para a página de login.
    // 'replace' impede o usuário de usar o botão "Voltar" do navegador
    // para voltar para a página protegida.
    return <Navigate to="/portal" state={{ from: location }} replace />;
  }

  // 2. O usuário está logado, mas ele tem o "papel" (role) correto?
  if (!allowedRoles.includes(user.role)) {
    // Se não tiver (ex: um 'doador' tentando ver a página 'admin'),
    // mande-o para o dashboard, que é uma página segura.
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Se o usuário está logado E tem o papel correto:
  // Mostre a página que ele tentou acessar (os 'children').
  return children;
}

export default ProtectedRoute;