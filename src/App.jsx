import React from 'react';
import { Routes, Route } from 'react-router-dom';

<<<<<<< HEAD
<<<<<<< HEAD
=======
// Importe os NOVOS Componentes de Layout que você criará
// CORRIGIDO: Adicionando a extensão .jsx
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
=======
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
import PublicLayout from './components/PublicLayout.jsx'; 
import ProtectedLayout from './components/ProtectedLayout.jsx'; 

import HomePage from './pages/HomePage';
import PortalPage from './pages/PortalPage';
import DoarPage from './pages/DoarPage';
import RelatoriosPage from './pages/RelatoriosPage';
import GovernancaPage from './pages/GovernancaPage';
<<<<<<< HEAD
=======

// Importações dos novos componentes de retorno de doação
import DoacaoSucessoPage from './pages/DoacaoSucessoPage';
import DoacaoFalhaPage from './pages/DoacaoFalhaPage';
import DoacaoPendentePage from './pages/DoacaoPendentePage';

>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
import DashboardPage from './pages/DashboardPage.jsx'; 
import AdminPage from './pages/AdminPage';
import VoluntarioPage from './pages/VoluntarioPage';

function App() {
<<<<<<< HEAD
<<<<<<< HEAD
  return (
    <Routes>
      
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/portal" element={<PortalPage />} />
        <Route path="/doar" element={<DoarPage />} />
        <Route path="/relatorios" element={<RelatoriosPage />} />
        <Route path="/governanca" element={<GovernancaPage />} />
      </Route>

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
=======
  return (
    <Routes>
        
        {/* --- ROTAS PÚBLICAS: USAM O PublicLayout (Header + Footer) --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/doar" element={<DoarPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/governanca" element={<GovernancaPage />} />
        </Route>

        {/* --- ROTAS PRIVADAS: USAM O ProtectedLayout (DashboardHeader + Footer) --- */}
        
        {/* ROTA DASHBOARD */}
        <Route path="/dashboard" element={
          <ProtectedLayout allowedRoles={['doador', 'voluntario', 'admin']}>
            <DashboardPage />
          </ProtectedLayout>
        } />

        {/* ROTA VOLUNTÁRIO */}
        <Route path="/voluntario" element={
          <ProtectedLayout allowedRoles={['voluntario', 'admin']}>
            <VoluntarioPage />
          </ProtectedLayout>
        } />

        {/* ROTA ADMIN */}
        <Route path="/admin" element={
          <ProtectedLayout allowedRoles={['admin']}>
            <AdminPage />
          </ProtectedLayout>
        } />
        
        {/* Adicione rotas 404/Not Found aqui */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
=======
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
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
}

export default App;