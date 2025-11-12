import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function EditMetaModal({ metaId, onClose, onSave }) {
  const { token } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState(0);
  const [prazo, setPrazo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const fetchMeta = async () => {
      setIsLoading(true);
      setFormError('');
      if (!token) {
        setFormError('Erro de autenticação: Token não disponível.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/metas/${metaId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Falha ao buscar dados da meta.');
        const data = await response.json();
        setTitulo(data.titulo);
        setDescricao(data.descricao);
        setValor(data.valor);
        setPrazo(data.prazo);
      } catch (err) {
        setFormError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (metaId && token) fetchMeta();
  }, [metaId, token]);

  const handleUpdateMeta = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
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
      setFormError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
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
          </form>
        )}
      </div>
    </div>
  );
}

export default EditMetaModal;
