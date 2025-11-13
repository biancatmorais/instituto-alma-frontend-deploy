import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

<<<<<<< HEAD
function EditEventoModal({ eventoId, onClose, onSave }) {
  const { token } = useAuth();
  
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState(''); 
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');

=======
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://instituto-alma-backend-azure-production.up.railway.app';

function EditEventoModal({ eventoId, onClose, onSave }) {
  const { token } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const fetchEvento = async () => {
      setIsLoading(true);
      try {
<<<<<<< HEAD
        const response = await fetch(`http://localhost:4000/api/eventos/${eventoId}`);
        if (!response.ok) throw new Error('Falha ao buscar dados do evento.');
        
=======
        const response = await fetch(`${API_BASE_URL}/api/eventos/${eventoId}`);
        if (!response.ok) throw new Error('Falha ao buscar dados do evento.');
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
        const data = await response.json();
        setTitulo(data.titulo || '');
        setLocal(data.local || '');
        setDescricao(data.descricao || '');
<<<<<<< HEAD
        
        const dataParaInput = data.data_evento ? data.data_evento.split('T')[0] : '';
        setData(dataParaInput);
        
=======
        setData(data.data_evento ? data.data_evento.split('T')[0] : '');
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
      } catch (err) {
        setFormError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
<<<<<<< HEAD

    fetchEvento();
  }, [eventoId]);


=======
    fetchEvento();
  }, [eventoId]);

>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
  const handleUpdateEvento = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
<<<<<<< HEAD

    const dadosAtualizados = {
      titulo,
      data: data, 
      local,
      descricao,
    };

    try {
      const response = await fetch(`http://localhost:4000/api/eventos/${eventoId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(dadosAtualizados)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao atualizar evento');

      setFormSuccess('Evento atualizado com sucesso!');
      
      onSave(); 
      
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      console.error("Erro ao atualizar evento:", err);
=======
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
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
      setFormError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
<<<<<<< HEAD
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Editar Evento</h2>

        {isLoading ? (
          <p>A carregar dados do evento...</p>
        ) : (
          <form onSubmit={handleUpdateEvento} className="modal-form">
            
            <div className="form-group">
              <label htmlFor="edit-evento-titulo" className="form-label">Título</label>
              <input 
                type="text" 
                id="edit-evento-titulo" 
                className="form-input" 
                value={titulo} 
                onChange={(e) => setTitulo(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-evento-data" className="form-label">Data (AAAA-MM-DD)</label>
              <input 
                type="date" 
                id="edit-evento-data" 
                className="form-input" 
                value={data} 
                onChange={(e) => setData(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-evento-local" className="form-label">Local</label>
              <input 
                type="text" 
                id="edit-evento-local" 
                className="form-input" 
                value={local} 
                onChange={(e) => setLocal(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-evento-desc" className="form-label">Descrição (para notificação)</label>
              <textarea 
                id="edit-evento-desc" 
                className="form-textarea" 
                value={descricao} 
                onChange={(e) => setDescricao(e.target.value)} 
                required
                style={{ backgroundColor: '#fff', minHeight: '100px' }}
              />
            </div>
            
            {formError && <p style={{ color: 'red', fontWeight: '600', marginBottom: '15px' }}>{formError}</p>}
            {formSuccess && <p style={{ color: 'green', fontWeight: '600', marginBottom: '15px' }}>{formSuccess}</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Salvar Alterações do Evento</button>
=======
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
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
          </form>
        )}
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default EditEventoModal;
=======
export default EditEventoModal;
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
