import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 

// Define a URL base da API (lendo do ambiente, ou usando fallback)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function EditMetaModal({ metaId, onClose, onSave }) {
    const { token } = useAuth();
    // Adiciona o useNavigate apenas para ser seguro, embora não seja usado diretamente aqui
    const navigate = useNavigate(); 

    // Estados do formulário (Meta pode ter título e valor, mas incluímos descrição/prazo para o modal)
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState(0);
    const [prazo, setPrazo] = useState('');

    // Estados de controlo
    const [isLoading, setIsLoading] = useState(true);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    // Efeito para buscar os dados da meta específica ao carregar o modal
    useEffect(() => {
        const fetchMeta = async () => {
            setIsLoading(true);
            setFormError(''); 

            if (!token || !metaId) {
                setFormError('Erro: Meta ID ou token de autenticação não disponível.');
                setIsLoading(false);
                return;
            }

            try {
                // USA API_BASE_URL
                const response = await fetch(`${API_BASE_URL}/api/metas/${metaId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Falha ao buscar dados da meta.');

                const data = await response.json();
                // Assumindo que a API retorna os campos 'titulo', 'descricao', 'valor_meta' e 'prazo'
                setTitulo(data.titulo || '');
                setDescricao(data.descricao || '');
                setValor(data.valor_meta || 0); // Ajustado para 'valor_meta' se for o nome no backend
                setPrazo(data.prazo ? data.prazo.substring(0, 10) : ''); // Limita a data para o formato YYYY-MM-DD
                
            } catch (err) {
                setFormError(err.message); 
            } finally {
                setIsLoading(false);
            }
        };

        fetchMeta();
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
            // USA API_BASE_URL
            const response = await fetch(`${API_BASE_URL}/api/metas/${metaId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ 
                    titulo, 
                    descricao, 
                    valor_meta: valor, // Usando 'valor_meta' para corresponder ao backend
                    prazo 
                }),
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro ao atualizar meta');

            setFormSuccess(data.message);
            onSave(); // Aciona o refetch na página principal
            setTimeout(onClose, 2000); // Fecha após 2 segundos
            
        } catch (err) {
            console.error("Erro ao atualizar meta:", err);
            setFormError(err.message);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Editar Meta ID: {metaId}</h2>

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
                            <label htmlFor="edit-meta-valor" className="form-label">Valor da Meta (R$)</label>
                            <input
                                type="number"
                                step="0.01"
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
                    </form>
                )}
            </div>
        </div>
    );
}

export default EditMetaModal;