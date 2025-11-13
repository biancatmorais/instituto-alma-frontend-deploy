import React from 'react';
<<<<<<< HEAD
import { Outlet } from 'react-router-dom'; 
import Header from './Header.jsx'; 
import Footer from './Footer.jsx'; 
=======
import { Outlet } from 'react-router-dom'; // Importa o Outlet
import Header from './Header.jsx'; // Confirme o nome do seu arquivo Header
import Footer from './Footer.jsx'; // Confirme o nome do seu arquivo Footer
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de

function PublicLayout() {
  return (
    <>
      <Header />
      
<<<<<<< HEAD
     
=======
      {/* Aqui é onde a página específica (ex: HomePage) será renderizada */}
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
      <main>
        <Outlet /> 
      </main>
      
      <Footer />
    </>
  );
}

export default PublicLayout;