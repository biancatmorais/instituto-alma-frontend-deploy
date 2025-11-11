import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from '../context/AuthContext'; 

const logoAlma = '/documentos/LOGO_V.8_ALMA.png'; 

function DashboardHeader() {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const scrollWithOffset = (el) => {
    const yOffset = -80; 
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
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
          <li><HashLink to="/#sobre-nos" scroll={scrollWithOffset}>Sobre Nós</HashLink></li>
          <li><HashLink to="/#atividades" scroll={scrollWithOffset}>Nossas Atividades</HashLink></li>
          <li><HashLink to="/#transparencia" scroll={scrollWithOffset}>Transparência</HashLink></li>
          <li><HashLink to="/#eventos" scroll={scrollWithOffset}>Eventos</HashLink></li>
          <li><HashLink to="/#ouvidoria" scroll={scrollWithOffset}>Ouvidoria</HashLink></li>
        </ul>
      </nav>
      
      <div className="nav-buttons">
        
        {user && user.role === 'admin' && (
          <Link to="/admin" className="btn btn-secondary btn-admin">Administração</Link>
        )}

        <button onClick={handleLogout} className="btn btn-logout">Sair</button>
      </div>
    </header>
  );
}

export default DashboardHeader;