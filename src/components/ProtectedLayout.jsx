import React from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
=======
// Importe os componentes necessários
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
=======
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
import ProtectedRoute from './ProtectedRoute.jsx'; 
import DashboardHeader from './DashboardHeader.jsx';
import Footer from './Footer.jsx';

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d

function ProtectedLayout({ children, allowedRoles }) {
  return (
    
<<<<<<< HEAD
=======
// Recebe 'children' (a página a ser renderizada) e 'allowedRoles' (as permissões)
function ProtectedLayout({ children, allowedRoles }) {
  return (
    // 1. O ProtectedRoute verifica o token e a role antes de renderizar qualquer coisa abaixo
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
=======
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
    <ProtectedRoute allowedRoles={allowedRoles}>
      
      <DashboardHeader />
      
<<<<<<< HEAD
<<<<<<< HEAD
     
=======
      {/* Renderiza a página privada (ex: AdminPage) se a permissão for concedida */}
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
=======
     
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
      <main>
        {children} 
      </main>
      
      <Footer />
    </ProtectedRoute>
  );
}

export default ProtectedLayout;