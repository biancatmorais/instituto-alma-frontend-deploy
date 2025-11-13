import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Header from './Header.jsx'; 
import Footer from './Footer.jsx'; 

function PublicLayout() {
  return (
    <>
      <Header />
      
     
      <main>
        <Outlet /> 
      </main>
      
      <Footer />
    </>
  );
}

export default PublicLayout;