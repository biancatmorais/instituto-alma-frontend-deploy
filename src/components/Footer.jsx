import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    
    <footer className="main-footer" style={{ marginTop: 0 }}>
      <div className="footer-content">
        
      
        <div className="footer-column logo-column">
          <Link to="/">
            <img 
              src="/documentos/LOGO_V.8_ALMA.png" 
              alt="Logo Instituto Alma" 
              className="footer-logo"
            />
          </Link>
          <p>
            Av. Liberdade, 532 - Liberdade<br />
            São Paulo - SP, 01502-001
          </p>
        </div>


        <div className="footer-column social-column">
          <h4>Acompanhe pelas redes:</h4>
          <div className="social-icons">
            <a 
              href="https://www.instagram.com/almainstituto_oficial" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon ig" 
              title="Instagram"
            >
              IG
            </a>
            <a 
              href="https://www.facebook.com/almainstituto.oficial" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon fb" 
              title="Facebook"
            >
              FB
            </a>
            <a 
              href="https://www.youtube.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon yt" 
              title="YouTube"
            >
              YT
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom-bar">
        © 2025 Instituto Alma. Todos os direitos reservados.
      </div>
    </footer>
  );
}

export default Footer;