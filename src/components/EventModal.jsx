import React, { useState } from 'react';

<<<<<<< HEAD
function EventModal({ onClose }) {
  // --- ESTADOS (Obrigatórios para o formulário) ---
=======
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://instituto-alma-backend-azure-production.up.railway.app';

function EventModal({ onClose }) {
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [isEnviado, setIsEnviado] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = async (e) => {
<<<<<<< HEAD
    e.preventDefault(); 
    setFormMessage('');

    try {
      const response = await fetch('http://localhost:4000/api/inscricoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email }),
      });
      
<<<<<<< HEAD
=======
      // Tenta ler o corpo JSON, mas não falha se estiver vazio
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
      let data = {};
      try {
          data = await response.json();
      } catch (jsonError) {
<<<<<<< HEAD
=======
          // Se falhar a leitura (porque o corpo está vazio), 
          // usaremos uma mensagem padrão se o status for 2xx.
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
          data.message = 'Inscrição realizada com sucesso! Avisaremos sobre novos eventos.';
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar inscrição.');
      }

      setIsEnviado(true);
<<<<<<< HEAD
      setFormMessage(data.message); 

=======
      // Usa a mensagem lida ou a mensagem padrão de sucesso.
      setFormMessage(data.message); 

      // Limpa os campos após o sucesso
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
      setNome('');
      setEmail('');

      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Erro no formulário do modal:', error);
<<<<<<< HEAD
=======
      // Mostra o erro 
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
      setFormMessage(error.message);
      setIsEnviado(true); 
    }
  };
  
<<<<<<< HEAD
=======
  // --- JSX (O que aparece na tela) ---
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        {!isEnviado ? (
          <>
            <h2>Seja Notificado!</h2>
            <p>Preencha os seus dados e avisaremos sobre os próximos eventos.</p>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="modal-nome" className="form-label">O seu Nome</label>
                <input
                  type="text"
                  id="modal-nome"
                  className="form-input"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="modal-email" className="form-label">O seu Email</label>
                <input
                  type="email"
                  id="modal-email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-red" style={{ width: '100%' }}>
                Enviar Inscrição
              </button>
=======
    e.preventDefault();
    setFormMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/inscricoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email }),
      });

      let data = {};
      try { data = await response.json(); } catch { data.message = 'Inscrição realizada com sucesso!'; }

      if (!response.ok) throw new Error(data.message || 'Erro ao enviar inscrição.');
      setIsEnviado(true);
      setFormMessage(data.message);
      setNome('');
      setEmail('');
      setTimeout(() => onClose(), 3000);
    } catch (error) {
      setFormMessage(error.message);
      setIsEnviado(true);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        {!isEnviado ? (
          <>
            <h2>Seja Notificado!</h2>
            <p>Preencha seus dados e avisaremos sobre os próximos eventos.</p>
            <form onSubmit={handleSubmit}>
              <label>Nome</label>
              <input value={nome} onChange={e => setNome(e.target.value)} required />
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              <button type="submit" className="btn btn-red">Enviar Inscrição</button>
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
            </form>
          </>
        ) : (
          <div className="modal-success">
            <h2 style={{ color: formMessage.startsWith('Erro:') ? '#C6421E' : '#81C784' }}>
              {formMessage.startsWith('Erro:') ? 'Erro!' : 'Obrigado!'}
            </h2>
            <p>{formMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default EventModal;
=======
export default EventModal;
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
