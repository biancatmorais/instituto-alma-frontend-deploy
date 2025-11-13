import React, { useState } from 'react';

// Define a URL base da API (lendo do ambiente, ou usando fallback local para desenvolvimento)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function EventModal({ onClose }) {

  // --- ESTADOS (Obrigatórios para o formulário) ---
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [isEnviado, setIsEnviado] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  // Lógica de envio do formulário de inscrição
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setFormMessage('');

    try {
      // Usa a URL base da API configurada para o endpoint de inscrições
      const response = await fetch(`${API_BASE_URL}/api/inscricoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email }),
      });
      
      let data = {};
      try {
        // Tenta ler a resposta JSON
        data = await response.json();
      } catch (jsonError) {
        // Caso o servidor responda com sucesso, mas sem um corpo JSON (ex: status 204), usamos uma mensagem padrão.
        data.message = 'Inscrição realizada com sucesso! Avisaremos sobre novos eventos.';
      }

      if (!response.ok) {
        // Lança erro se a resposta não for 2xx
        throw new Error(data.message || 'Erro ao enviar inscrição.');
      }

      // Sucesso
      setIsEnviado(true);
      setFormMessage(data.message || 'Inscrição efetuada com sucesso!'); 

      setNome('');
      setEmail('');

      // Fecha o modal após 3 segundos
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Erro no formulário do modal:', error);
      // Exibe a mensagem de erro no modal
      setFormMessage(`Erro: ${error.message}`);
      setIsEnviado(true); // Muda para a visualização de mensagem
    }
  };
  
  return (
    // Ouve o clique no overlay para fechar o modal
    <div className="modal-overlay" onClick={onClose}> 
      {/* Impede que o clique dentro do modal feche-o */}
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
            {/* Usa a cor vermelha para erros e uma cor de sucesso para mensagens positivas */}
            <h2 style={{ color: formMessage && formMessage.startsWith('Erro:') ? '#f06678' : '#6efff1' }}>
              {formMessage && formMessage.startsWith('Erro:') ? 'Houve um Erro!' : 'Inscrição Feita!'}
            </h2>
            <p>{formMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventModal;