import React from 'react';

// Importe os componentes necessários
import ProtectedRoute from './ProtectedRoute.jsx'; 
import DashboardHeader from './DashboardHeader.jsx';
import Footer from './Footer.jsx';


function ProtectedLayout({ children, allowedRoles }) {
  return (
    
    <ProtectedRoute allowedRoles={allowedRoles}>
      
      <DashboardHeader />


      {/* Renderiza a página privada (ex: AdminPage) se a permissão for concedida */}

      <main>
        {children} 
      </main>
      
      <Footer />
    </ProtectedRoute>
  );
}

export default ProtectedLayout;