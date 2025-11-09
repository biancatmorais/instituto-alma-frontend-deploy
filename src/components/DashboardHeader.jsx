import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from '../context/AuthContext'; // Importa o hook de autenticação

// Caminho para a logo na pasta /public/documentos/
const logoAlma = '/documentos/LOGO_V.8_ALMA.png'; 

function DashboardHeader() {
  const { user, logout } = useAuth(); // Pega o usuário e a função de logout
  const navigate = useNavigate();

  const scrollWithOffset = (el) => {
    const yOffset = -80; 
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    logout(); // Limpa o token do contexto/localStorage
    navigate('/'); // Envia o usuário de volta para a Home
  };

  return (
    <header className="main-header">
      <div className="logo">
        <Link to="/">
          <img src={logoAlma} alt="Logo Instituto Alma" />
        </Link>
      </div>
      
      <nav className="main-nav">
        <ul>
          {/* AQUI ESTAVA O ERRO! 
            Eu provavelmente fechei estas tags com </a> em vez de </HashLink>.
            Esta versão está correta.
          */}
          <li><HashLink to="/#sobre-nos" scroll={scrollWithOffset}>Sobre Nós</HashLink></li>
          <li><HashLink to="/#atividades" scroll={scrollWithOffset}>Nossas Atividades</HashLink></li>
          <li><HashLink to="/#transparencia" scroll={scrollWithOffset}>Transparência</HashLink></li>
          <li><HashLink to="/#eventos" scroll={scrollWithOffset}>Eventos</HashLink></li>
          <li><HashLink to="/#ouvidoria" scroll={scrollWithOffset}>Ouvidoria</HashLink></li>
        </ul>
      </nav>
      
      <div className="nav-buttons">
        
        {/* Lógica condicional para o "papel" (role) */}
        {user && user.role === 'admin' && (
          <Link to="/admin" className="btn btn-secondary btn-admin">Administração</Link>
        )}

        {/* Botão de Sair */}
        <button onClick={handleLogout} className="btn btn-logout">Sair</button>
      </div>
    </header>
  );
}

export default DashboardHeader;