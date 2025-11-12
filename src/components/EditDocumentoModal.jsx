import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function EditDocumentoModal({ documentoId, onClose, onSave }) {
  const { token } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [oldFilename, setOldFilename] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const fetchDocumento = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/documentos/${documentoId}`);
        if (!response.ok) throw new Error('Falha ao buscar dados do documento.');
        const data = await response.json();
        setTitulo(data.titulo);
        setOldFilename(data.arquivo_url);
      } catch (err) {
        setFormError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocumento();
  }, [documentoId]);

  const handleUpdateDocumento = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    const formData = new FormData();
    formData.append('titulo', titulo);
    if (arquivo) formData.append('arquivo', arquivo);

    try {
      const response = await fetch(`${API_BASE_URL}/api/documentos/${documentoId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao atualizar documento');
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
        <h2>Editar Documento</h2>
        {isLoading ? (
          <p>A carregar dados...</p>
        ) : (
          <form onSubmit={handleUpdateDocumento}>
            <label>Título do Documento</label>
            <input value={titulo} onChange={e => setTitulo(e.target.value)} required />
            <p>Arquivo atual: {oldFilename || 'Nenhum'}</p>
            <input type="file" accept=".pdf" onChange={e => setArquivo(e.target.files[0])} />
            {formError && <p style={{ color: 'red' }}>{formError}</p>}
            {formSuccess && <p style={{ color: 'green' }}>{formSuccess}</p>}
            <button type="submit" className="btn btn-primary">Salvar Alterações</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditDocumentoModal;
