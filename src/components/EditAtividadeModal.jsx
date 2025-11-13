import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx'; // Nota: Manter a extensão .jsx

// Define a URL base da API (lendo do ambiente, ou usando fallback local)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://instituto-alma-backend-azure-production.up.railway.app';

function EditAtividadeModal({ atividadeId, onClose, onSave }) {
    const { token } = useAuth();

    // Estados do formulário
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [imagem1, setImagem1] = useState(null);
    const [imagem2, setImagem2] = useState(null);
    const [imagem3, setImagem3] = useState(null);
    const [imagem4, setImagem4] = useState(null);

    // Estados de feedback e UI
    const [isLoading, setIsLoading] = useState(true);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    // URLs das imagens antigas (para exibição e rastreamento)
    const [oldImages, setOldImages] = useState({});

    // 1. Buscar os dados da atividade quando o modal abre (GET)
    const fetchAtividade = useCallback(async () => {
        setIsLoading(true);
        setFormError('');

        if (!token) {
            setFormError('Erro de autenticação: Token não disponível.');
            setIsLoading(false);
            return;
        }

        try {
            // Usa API_BASE_URL
            const response = await fetch(`${API_BASE_URL}/api/atividades/${atividadeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao buscar dados da atividade.');
            }

            const data = await response.json();
            setTitulo(data.titulo);
            setDescricao(data.descricao);
            setOldImages({
                img1: data.imagem_url_1,
                img2: data.imagem_url_2,
                img3: data.imagem_url_3,
                img4: data.imagem_url_4,
            });

        } catch (err) {
            setFormError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [atividadeId, token]);

    useEffect(() => {
        if (atividadeId && token) {
            fetchAtividade();
        }
    }, [atividadeId, token, fetchAtividade]);


    // 2. Função para enviar a ATUALIZAÇÃO (PUT)
    const handleUpdateAtividade = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');

        if (!token) {
            setFormError('Sessão expirada. Por favor, faça login novamente.');
            return;
        }

        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('descricao', descricao);

        // Anexa os ficheiros NOVOS (se o user selecionou algum)
        // O backend deve lidar com a substituição de ficheiros antigos
        if (imagem1) formData.append('imagem_1', imagem1);
        if (imagem2) formData.append('imagem_2', imagem2);
        if (imagem3) formData.append('imagem_3', imagem3);
        if (imagem4) formData.append('imagem_4', imagem4);

        try {
            // Usa API_BASE_URL
            const response = await fetch(`${API_BASE_URL}/api/atividades/${atividadeId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }, // Headers para autenticação
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro ao atualizar atividade');

            setFormSuccess(data.message);
            onSave(); // Aciona o refetch na página principal
            fetchAtividade(); // Atualiza o modal com novos nomes de ficheiro (se houver)

            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err) {
            console.error("Erro ao atualizar atividade:", err);
            setFormError(err.message);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Editar Atividade ID: {atividadeId}</h2>

                {isLoading ? (
                    <p>A carregar dados...</p>
                ) : (
                    <form onSubmit={handleUpdateAtividade} className="modal-form">
                        <div className="form-group">
                            <label htmlFor="edit-ativ-titulo" className="form-label">Título da Atividade</label>
                            <input type="text" id="edit-ativ-titulo" className="form-input" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit-ativ-desc" className="form-label">Descrição</label>
                            <textarea id="edit-ativ-desc" className="form-textarea" style={{ backgroundColor: '#fff', minHeight: '150px' }} value={descricao} onChange={(e) => setDescricao(e.target.value)} required></textarea>
                        </div>

                        <p style={{textAlign: 'center', fontWeight: 600, marginBottom: '15px'}}>
                            Atenção: Enviar uma nova imagem irá substituir permanentemente a antiga.
                        </p>

                        <div className="form-group">
                            <label htmlFor="edit-ativ-img1" className="form-label">Imagem 1 (Atual: {oldImages.img1 || 'Nenhuma'})</label>
                            <input type="file" id="edit-ativ-img1" className="form-input" onChange={(e) => setImagem1(e.target.files[0])} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit-ativ-img2" className="form-label">Imagem 2 (Atual: {oldImages.img2 || 'Nenhuma'})</label>
                            <input type="file" id="edit-ativ-img2" className="form-input" onChange={(e) => setImagem2(e.target.files[0])} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit-ativ-img3" className="form-label">Imagem 3 (Atual: {oldImages.img3 || 'Nenhuma'})</label>
                            <input type="file" id="edit-ativ-img3" className="form-input" onChange={(e) => setImagem3(e.target.files[0])} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit-ativ-img4" className="form-label">Imagem 4 (Atual: {oldImages.img4 || 'Nenhuma'})</label>
                            <input type="file" id="edit-ativ-img4" className="form-input" onChange={(e) => setImagem4(e.target.files[0])} />
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

export default EditAtividadeModal;