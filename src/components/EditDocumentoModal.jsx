import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Define a URL base da API lendo a variável de ambiente.
// Use 'http://localhost:4000' como fallback para desenvolvimento local.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function EditDocumentoModal({ documentoId, onClose, onSave }) {
  const { token } = useAuth();
  
  const [titulo, setTitulo] = useState('');
  const [arquivo, setArquivo] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  const [oldFilename, setOldFilename] = useState('');

  useEffect(() => {
    const fetchDocumento = async () => {
      setIsLoading(true);
      try {
        // MUDANÇA 1: Usando API_BASE_URL para buscar dados
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
    
    if (arquivo) {
      formData.append('arquivo', arquivo);
    }

    try {
      // MUDANÇA 2: Usando API_BASE_URL para a requisição PUT
      const response = await fetch(`${API_BASE_URL}/api/documentos/${documentoId}`, {
        method: 'PUT',
        // Certifique-se de que o backend não requer o token de autenticação para GET, 
        // mas sim para PUT (como está configurado aqui).
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
      setFormError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
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
          </form>
        )}
      </div>
    </div>
  );
}

export default EditDocumentoModal;