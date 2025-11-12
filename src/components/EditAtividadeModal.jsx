import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function EditAtividadeModal({ atividadeId, onClose, onSave }) {
  const { token } = useAuth(); 
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAtividade = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/atividades/${atividadeId}`);
        if (!response.ok) throw new Error('Falha ao buscar dados da atividade.');

        const data = await response.json();
        setTitulo(data.titulo);
        setDescricao(data.descricao);
      } catch (err) {
        setFormError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAtividade();
  }, [atividadeId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/atividades/${atividadeId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, descricao })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao atualizar atividade');

      setFormSuccess('Atividade atualizada com sucesso!');
      onSave();
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error(err);
      setFormError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn">&times;</button>
        <h2>Editar Atividade</h2>

        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <form onSubmit={handleUpdate}>
            <label>Título</label>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required />

            <label>Descrição</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required />

            {formError && <p style={{ color: 'red' }}>{formError}</p>}
            {formSuccess && <p style={{ color: 'green' }}>{formSuccess}</p>}

            <button type="submit" className="btn btn-primary">Salvar</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditAtividadeModal;
