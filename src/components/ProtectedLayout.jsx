import React from 'react';
<<<<<<< HEAD
=======
// Importe os componentes necessários
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
import ProtectedRoute from './ProtectedRoute.jsx'; 
import DashboardHeader from './DashboardHeader.jsx';
import Footer from './Footer.jsx';

<<<<<<< HEAD

function ProtectedLayout({ children, allowedRoles }) {
  return (
    
=======
// Recebe 'children' (a página a ser renderizada) e 'allowedRoles' (as permissões)
function ProtectedLayout({ children, allowedRoles }) {
  return (
    // 1. O ProtectedRoute verifica o token e a role antes de renderizar qualquer coisa abaixo
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
    <ProtectedRoute allowedRoles={allowedRoles}>
      
      <DashboardHeader />
      
<<<<<<< HEAD
     
=======
      {/* Renderiza a página privada (ex: AdminPage) se a permissão for concedida */}
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
      <main>
        {children} 
      </main>
      
      <Footer />
    </ProtectedRoute>
  );
}

export default ProtectedLayout;