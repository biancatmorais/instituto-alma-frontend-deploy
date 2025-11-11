import React from 'react';
import { Routes, Route } from 'react-router-dom';

import PublicLayout from './components/PublicLayout.jsx'; 
import ProtectedLayout from './components/ProtectedLayout.jsx'; 

import HomePage from './pages/HomePage';
import PortalPage from './pages/PortalPage';
import DoarPage from './pages/DoarPage';
import RelatoriosPage from './pages/RelatoriosPage';
import GovernancaPage from './pages/GovernancaPage';

// Importações dos novos componentes de retorno de doação
import DoacaoSucessoPage from './pages/DoacaoSucessoPage';
import DoacaoFalhaPage from './pages/DoacaoFalhaPage';
import DoacaoPendentePage from './pages/DoacaoPendentePage';

import DashboardPage from './pages/DashboardPage.jsx'; 
import AdminPage from './pages/AdminPage';
import VoluntarioPage from './pages/VoluntarioPage';

function App() {
  return (
    <Routes>
      
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/portal" element={<PortalPage />} />
        <Route path="/doar" element={<DoarPage />} />
        <Route path="/relatorios" element={<RelatoriosPage />} />
        <Route path="/governanca" element={<GovernancaPage />} />

        {/* 💳 NOVAS ROTAS DE RETORNO DO PAGAMENTO */}
        <Route path="/doacao/sucesso" element={<DoacaoSucessoPage />} />
        <Route path="/doacao/falha" element={<DoacaoFalhaPage />} />
        <Route path="/doacao/pendente" element={<DoacaoPendentePage />} />
      </Route>

      {/* Rotas Protegidas */}
      <Route path="/dashboard" element={
        <ProtectedLayout allowedRoles={['doador', 'voluntario', 'admin']}>
          <DashboardPage />
        </ProtectedLayout>
      } />

      <Route path="/voluntario" element={
        <ProtectedLayout allowedRoles={['voluntario', 'admin']}>
          <VoluntarioPage />
        </ProtectedLayout>
      } />

      <Route path="/admin" element={
        <ProtectedLayout allowedRoles={['admin']}>
          <AdminPage />
        </ProtectedLayout>
      } />
      
    </Routes>
  );
}

export default App;