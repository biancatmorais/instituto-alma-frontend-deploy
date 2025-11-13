import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/TempAuthContext';

<<<<<<< HEAD
function EditDocumentoModal({ documentoId, onClose, onSave }) {
  const { token } = useAuth();
  
  const [titulo, setTitulo] = useState('');
  const [arquivo, setArquivo] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  const [oldFilename, setOldFilename] = useState('');
=======
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://instituto-alma-backend-azure-production.up.railway.app';

function EditDocumentoModal({ documentoId, onClose, onSave }) {
  const { token } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [oldFilename, setOldFilename] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d

  useEffect(() => {
    const fetchDocumento = async () => {
      setIsLoading(true);
      try {
<<<<<<< HEAD
<<<<<<< HEAD
=======
        // Busca os dados do documento específico
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
        const response = await fetch(`http://localhost:4000/api/documentos/${documentoId}`);
        if (!response.ok) throw new Error('Falha ao buscar dados do documento.');
        
        const data = await response.json();
        setTitulo(data.titulo);
        setOldFilename(data.arquivo_url);
        
=======
        const response = await fetch(`${API_BASE_URL}/api/documentos/${documentoId}`);
        if (!response.ok) throw new Error('Falha ao buscar dados do documento.');
        const data = await response.json();
        setTitulo(data.titulo);
        setOldFilename(data.arquivo_url);
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
      } catch (err) {
        setFormError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
<<<<<<< HEAD

    fetchDocumento();
  }, [documentoId]);


=======
    fetchDocumento();
  }, [documentoId]);

>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
  const handleUpdateDocumento = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
<<<<<<< HEAD

    const formData = new FormData();
    formData.append('titulo', titulo);
    
    if (arquivo) {
      formData.append('arquivo', arquivo);
    }

    try {
<<<<<<< HEAD
=======
      // Chama a rota PUT
>>>>>>> a3fd0cb31eaa2e015bbf28109434b1e461b310de
      const response = await fetch(`http://localhost:4000/api/documentos/${documentoId}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao atualizar documento');

      setFormSuccess(data.message); 
      
      onSave(); 
      
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      console.error("Erro ao atualizar documento:", err);
=======
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
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
      setFormError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
<<<<<<< HEAD
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Editar Documento</h2>

        {isLoading ? (
          <p>A carregar dados...</p>
        ) : (
          <form onSubmit={handleUpdateDocumento} className="modal-form">
            <div className="form-group">
              <label htmlFor="edit-doc-titulo" className="form-label">Título do Documento</label>
              <input type="text" id="edit-doc-titulo" className="form-input" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
            </div>
            
            <p style={{textAlign: 'center', fontWeight: 600, marginBottom: '15px'}}>
              Atenção: Enviar um novo PDF irá substituir permanentemente o antigo.
            </p>

            <div className="form-group">
              <label htmlFor="edit-doc-arquivo" className="form-label">Substituir PDF (Opcional)</label>
              <p style={{fontSize: '14px', marginBottom: '10px'}}>Ficheiro Atual: {oldFilename || 'Nenhum'}</p>
              <input 
                type="file" 
                id="edit-doc-arquivo" 
                className="form-input" 
                accept=".pdf" 
                onChange={(e) => setArquivo(e.target.files[0])} 
              />
            </div>
            
            {formError && <p style={{ color: 'red', fontWeight: '600', marginBottom: '15px' }}>{formError}</p>}
            {formSuccess && <p style={{ color: 'green', fontWeight: '600', marginBottom: '15px' }}>{formSuccess}</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Salvar Alterações</button>
=======
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
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
          </form>
        )}
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default EditDocumentoModal;
=======
export default EditDocumentoModal;
>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
