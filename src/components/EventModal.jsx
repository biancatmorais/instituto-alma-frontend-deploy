import React, { useState } from 'react';

function EventModal({ onClose }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [isEnviado, setIsEnviado] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = async (e) => {
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
      
      let data = {};
      try {
          data = await response.json();
      } catch (jsonError) {
          data.message = 'Inscrição realizada com sucesso! Avisaremos sobre novos eventos.';
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar inscrição.');
      }

      setIsEnviado(true);
      setFormMessage(data.message); 

      setNome('');
      setEmail('');

      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Erro no formulário do modal:', error);
      setFormMessage(error.message);
      setIsEnviado(true); 
    }
  };
  
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

export default EventModal;