import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importe os Headers
import Header from './components/Header';
import DashboardHeader from './components/DashboardHeader.jsx'; 
import Footer from './components/Footer.jsx'; 
// 1. IMPORTE O NOSSO NOVO "SEGURANÇA"
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Importe suas páginas
import HomePage from './pages/HomePage';
import PortalPage from './pages/PortalPage';
import DoarPage from './pages/DoarPage';
import RelatoriosPage from './pages/RelatoriosPage';
import GovernancaPage from './pages/GovernancaPage';
import DashboardPage from './pages/DashboardPage.jsx'; 
import AdminPage from './pages/AdminPage';
import VoluntarioPage from './pages/VoluntarioPage';

function App() {
  return (
    <div>
      <Routes>
        {/* --- ROTAS PÚBLICAS --- */}
        {/* (Qualquer um pode ver) */}
        <Route path="/" element={<><Header /><HomePage /></>} />
        <Route path="/portal" element={<><Header /><PortalPage /></>} />
        <Route path="/doar" element={<><Header /><DoarPage /></>} />
        <Route path="/relatorios" element={<><Header /><RelatoriosPage /></>} />
        <Route path="/governanca" element={<><Header /><GovernancaPage /></>} />

        {/* --- ROTAS PRIVADAS (PROTEGIDAS) --- */}
        
        {/* ROTA DASHBOARD (Qualquer usuário logado pode ver) */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['doador', 'voluntario', 'admin']}>
            <DashboardHeader />
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* ROTA VOLUNTÁRIO (Apenas 'voluntario' e 'admin' podem ver) */}
        <Route path="/voluntario" element={
          <ProtectedRoute allowedRoles={['voluntario', 'admin']}>
            <DashboardHeader />
            <VoluntarioPage />
          </ProtectedRoute>
        } />

        {/* ROTA ADMIN (Apenas 'admin' pode ver) */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardHeader />
            <AdminPage />
          </ProtectedRoute>
        } />
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;