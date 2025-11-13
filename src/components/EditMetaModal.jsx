import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/TempAuthContext';

<<<<<<< HEAD
<<<<<<< HEAD
function EditMetaModal({ metaId, onClose, onSave }) {
  const { token } = useAuth(); 
  
=======
// Este componente é para editar Metas
function EditMetaModal({ metaId, onClose, onSave }) {
  const { token } = useAuth(); // O token é necessário
  
  // Estados do formulário (Exemplo para Metas)
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
=======
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://instituto-alma-backend-azure-production.up.railway.app';

function EditMetaModal({ metaId, onClose, onSave }) {
  const { token } = useAuth();
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState(0);
  const [prazo, setPrazo] = useState('');
<<<<<<< HEAD

  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
<<<<<<< HEAD
=======
  // 1. Buscar os dados da meta quando o modal abre (GET)
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
  useEffect(() => {
    const fetchMeta = async () => {
      setIsLoading(true);
      setFormError(''); 
      
=======
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const fetchMeta = async () => {
      setIsLoading(true);
      setFormError('');
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
      if (!token) {
        setFormError('Erro de autenticação: Token não disponível.');
        setIsLoading(false);
        return;
      }
<<<<<<< HEAD

      try {
<<<<<<< HEAD
=======
        // Corrigido: usando crases e endpoint correto
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
        const response = await fetch(`http://localhost:4000/api/metas/${metaId}`, {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        });

        if (!response.ok) {
          const errorText = await response.text(); 
          let errorMessage = `Falha ao buscar dados. Status: ${response.status}.`;
          
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
          } catch (e) {
<<<<<<< HEAD
=======
            // Se não for JSON, usamos o status.
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
          }
          throw new Error(errorMessage);
        }
        
=======
      try {
        const response = await fetch(`${API_BASE_URL}/api/metas/${metaId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Falha ao buscar dados da meta.');
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
        const data = await response.json();
        setTitulo(data.titulo);
        setDescricao(data.descricao);
        setValor(data.valor);
        setPrazo(data.prazo);
<<<<<<< HEAD
        
      } catch (err) {
        setFormError(err.message); 
=======
      } catch (err) {
        setFormError(err.message);
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
      } finally {
        setIsLoading(false);
      }
    };
<<<<<<< HEAD

    if (metaId && token) { 
      fetchMeta();
    }
  }, [metaId, token]);


=======
    if (metaId && token) fetchMeta();
  }, [metaId, token]);

>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
  const handleUpdateMeta = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
<<<<<<< HEAD
    
<<<<<<< HEAD
=======
    // Verifica se o token existe antes de enviar
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
    if (!token) {
      setFormError('Sessão expirada. Por favor, faça login novamente.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/metas/${metaId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }, 
        body: JSON.stringify({ titulo, descricao, valor, prazo })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao atualizar meta');

      setFormSuccess(data.message); 
      onSave(); 
      
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      console.error("Erro ao atualizar meta:", err);
=======
    if (!token) {
      setFormError('Sessão expirada. Faça login novamente.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/metas/${metaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ titulo, descricao, valor, prazo }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao atualizar meta');
      setFormSuccess(data.message);
      onSave();
      setTimeout(onClose, 2000);
    } catch (err) {
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
      setFormError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
<<<<<<< HEAD
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Editar Meta</h2>

        {isLoading ? (
          <p>A carregar dados...</p>
        ) : (
          <form onSubmit={handleUpdateMeta} className="modal-form">
            <div className="form-group">
              <label htmlFor="edit-meta-titulo" className="form-label">Título da Meta</label>
              <input
                type="text"
                id="edit-meta-titulo"
                className="form-input"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-meta-desc" className="form-label">Descrição</label>
              <textarea
                id="edit-meta-desc"
                className="form-textarea"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="edit-meta-valor" className="form-label">Valor (R$)</label>
              <input
                type="number"
                id="edit-meta-valor"
                className="form-input"
                value={valor}
                onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-meta-prazo" className="form-label">Prazo (YYYY-MM-DD)</label>
              <input
                type="date"
                id="edit-meta-prazo"
                className="form-input"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
                required
              />
            </div>

            {formError && (
              <p style={{ color: 'red', fontWeight: '600', marginBottom: '15px' }}>{formError}</p>
            )}
            {formSuccess && (
              <p style={{ color: 'green', fontWeight: '600', marginBottom: '15px' }}>{formSuccess}</p>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Salvar Alterações
            </button>
=======
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Editar Meta</h2>
        {isLoading ? (
          <p>A carregar dados...</p>
        ) : (
          <form onSubmit={handleUpdateMeta}>
            <label>Título da Meta</label>
            <input value={titulo} onChange={e => setTitulo(e.target.value)} required />
            <label>Descrição</label>
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} required />
            <label>Valor (R$)</label>
            <input type="number" value={valor} onChange={e => setValor(parseFloat(e.target.value) || 0)} required />
            <label>Prazo</label>
            <input type="date" value={prazo} onChange={e => setPrazo(e.target.value)} required />
            {formError && <p style={{ color: 'red' }}>{formError}</p>}
            {formSuccess && <p style={{ color: 'green' }}>{formSuccess}</p>}
            <button type="submit" className="btn btn-primary">Salvar Alterações</button>
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
          </form>
        )}
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default EditMetaModal;
=======
export default EditMetaModal;
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
