import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://instituto-alma-backend-azure-production.up.railway.app';

function EventModal({ onClose }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [isEnviado, setIsEnviado] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = async (e) => {
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
