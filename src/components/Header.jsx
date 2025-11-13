import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';


function Header() {
  
  const scrollWithOffset = (el) => {
    const yOffset = -80; 
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (

    <header className="main-header">
      <div className="logo">
        
<<<<<<< HEAD
        {/* 2. 'href="/"' virou 'to="/"' usando <Link> */}
        <Link to="/">
          {/* 3. Caminho da imagem ajustado para a pasta /public */}
          {/* e a tag foi fechada com '/>' */}
=======
        
        <Link to="/">
          
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
          <img 
            src="/documentos/LOGO_V.8_ALMA.png" 
            alt="Logo Instituto Alma - Instituto de Desenvolvimento Social" 
          />
        </Link>
      </div>
      
      <nav className="main-nav">
        <ul>
<<<<<<< HEAD
          {/* 4. Todos os links de âncora viraram <HashLink> */}
          {/* Eles apontam para /#id_da_secao e usam a função de rolagem */}
=======
          
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
          <li><HashLink to="/#sobre-nos" scroll={scrollWithOffset}>Sobre Nós</HashLink></li>
          <li><HashLink to="/#atividades" scroll={scrollWithOffset}>Nossas Atividades</HashLink></li>
          <li><HashLink to="/#transparencia" scroll={scrollWithOffset}>Transparência</HashLink></li>
          <li><HashLink to="/#eventos" scroll={scrollWithOffset}>Eventos</HashLink></li>
          <li><HashLink to="/#ouvidoria" scroll={scrollWithOffset}>Ouvidoria</HashLink></li>
        </ul>
      </nav>
      
      <div className="nav-buttons">
<<<<<<< HEAD
        {/* 5. Links para outras páginas usam <Link> e 'to="caminho"' */}
=======
        
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
        <Link to="/doar" className="btn btn-secondary">Seja um Doador</Link>
        <Link to="/portal" className="btn btn-primary">Portal do Doador</Link>
      </div>
    </header>
  );
}

export default Header;