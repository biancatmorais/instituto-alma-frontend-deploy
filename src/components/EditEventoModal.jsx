import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function EditEventoModal({ eventoId, onClose, onSave }) {
  const { token } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const fetchEvento = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/eventos/${eventoId}`);
        if (!response.ok) throw new Error('Falha ao buscar dados do evento.');
        const data = await response.json();
        setTitulo(data.titulo || '');
        setLocal(data.local || '');
        setDescricao(data.descricao || '');
        setData(data.data_evento ? data.data_evento.split('T')[0] : '');
      } catch (err) {
        setFormError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvento();
  }, [eventoId]);

  const handleUpdateEvento = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/eventos/${eventoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo, data, local, descricao }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao atualizar evento');
      setFormSuccess('Evento atualizado com sucesso!');
      onSave();
      setTimeout(onClose, 2000);
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Editar Evento</h2>
        {isLoading ? (
          <p>Carregando dados do evento...</p>
        ) : (
          <form onSubmit={handleUpdateEvento}>
            <label>Título</label>
            <input value={titulo} onChange={e => setTitulo(e.target.value)} required />
            <label>Data</label>
            <input type="date" value={data} onChange={e => setData(e.target.value)} required />
            <label>Local</label>
            <input value={local} onChange={e => setLocal(e.target.value)} required />
            <label>Descrição</label>
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} required />
            {formError && <p style={{ color: 'red' }}>{formError}</p>}
            {formSuccess && <p style={{ color: 'green' }}>{formSuccess}</p>}
            <button type="submit" className="btn btn-primary">Salvar Alterações</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditEventoModal;
