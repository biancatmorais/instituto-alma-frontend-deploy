import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx'; // Nota: Mantenha a extensão .jsx

// Define a URL base da API (lendo do ambiente, ou usando fallback)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function EditDocumentoModal({ documentoId, onClose, onSave }) {
    const { token } = useAuth();
    
    // Estados para carregar e atualizar o documento
    const [titulo, setTitulo] = useState('');
    const [novoArquivo, setNovoArquivo] = useState(null);
    const [oldFilename, setOldFilename] = useState(''); // Para exibir o nome atual do ficheiro
    
    // Estados de controlo
    const [isLoading, setIsLoading] = useState(true);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    // Efeito para buscar os dados do documento ao carregar o modal
    useEffect(() => {
        const fetchDocumento = async () => {
            setIsLoading(true);
            setFormError(''); 

            if (!token || !documentoId) {
                setFormError('Erro: ID do documento ou token de autenticação não disponível.');
                setIsLoading(false);
                return;
            }

            try {
                // USA API_BASE_URL
                const response = await fetch(`${API_BASE_URL}/api/documentos/${documentoId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
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
    }, [documentoId, token]);


    const handleUpdateDocumento = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');

        if (!token) {
            setFormError('Sessão expirada. Faça login novamente.');
            return;
        }

        const formData = new FormData();
        formData.append('titulo', titulo);
        
        // Se um novo ficheiro foi selecionado, anexa-o ao FormData
        if (novoArquivo) {
            formData.append('arquivo', novoArquivo); 
        }

        try {
            // USA API_BASE_URL
            const response = await fetch(`${API_BASE_URL}/api/documentos/${documentoId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro ao atualizar documento');

            setFormSuccess(data.message);
            onSave(); // Aciona o refetch na página principal
            setTimeout(onClose, 2000); // Fecha após 2 segundos
            
        } catch (err) {
            console.error("Erro ao atualizar documento:", err);
            setFormError(err.message);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Editar Documento ID: {documentoId}</h2>

                {isLoading ? (
                    <p>A carregar dados...</p>
                ) : (
                    <form onSubmit={handleUpdateDocumento} className="modal-form">
                        <div className="form-group">
                            <label htmlFor="edit-doc-titulo" className="form-label">Título do Documento</label>
                            <input
                                type="text"
                                id="edit-doc-titulo"
                                className="form-input"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Ficheiro Atual</label>
                            <p style={{ fontSize: '0.9em', color: '#666' }}>
                                {oldFilename} (
                                <a href={`${API_BASE_URL}/uploads/${oldFilename}`} target="_blank" rel="noopener noreferrer" style={{ color: '#C6421E' }}>Ver</a>
                                )
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-doc-arquivo" className="form-label">Substituir Ficheiro PDF (Opcional)</label>
                            <input
                                type="file"
                                id="edit-doc-arquivo"
                                className="form-input"
                                accept=".pdf"
                                onChange={(e) => setNovoArquivo(e.target.files[0])}
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
                    </form>
                )}
            </div>
        </div>
    );
}

export default EditDocumentoModal;