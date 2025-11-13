import React, { useState, useEffect, useCallback } from 'react'; 
import { useAuth } from '../context/AuthContext'; 
import EditAtividadeModal from '../components/EditAtividadeModal.jsx'; 
import EditDocumentoModal from '../components/EditDocumentoModal.jsx'; 
import EditMetaModal from '../components/EditMetaModal.jsx'; 
import EditEventoModal from '../components/EditEventoModal.jsx'; 

function AdminPage() {
    const { token } = useAuth();

    const API_BASE = process.env.REACT_APP_API_URL || 'https://instituto-alma-backend-azure-production.up.railway.app';

    // Estados dos modais
    const [modalState, setModalState] = useState({
        atividade: null,
        documento: null,
        meta: null,
        evento: null
    });

    // Dados gerais
    const [mensagens, setMensagens] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [atividades, setAtividades] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [metas, setMetas] = useState([]);
    const [inscricoes, setInscricoes] = useState([]);

    // Loading e erros
    const [loading, setLoading] = useState({
        mensagens: true,
        eventos: true,
        atividades: true,
        documentos: true,
        metas: true,
        inscricoes: true
    });
    const [error, setError] = useState({
        mensagens: null,
        eventos: null,
        atividades: null,
        documentos: null,
        metas: null,
        inscricoes: null
    });

    // Formulários
    const [forms, setForms] = useState({
        evento: { titulo: '', descricao: '', data: '', local: '', success: '', error: '' },
        atividade: { titulo: '', descricao: '', imagens: [], success: '', error: '' },
        documento: { titulo: '', arquivo: null, success: '', error: '' },
        meta: { titulo: '', valor: '', success: '', error: '' }
    });

    // Função genérica de fetch
    const fetchData = useCallback(async (url, setState, setLoadingKey, setErrorKey, options = {}) => {
        setLoading(prev => ({ ...prev, [setLoadingKey]: true }));
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro ao buscar dados.');
            setState(data);
            setError(prev => ({ ...prev, [setErrorKey]: null }));
        } catch (err) {
            setError(prev => ({ ...prev, [setErrorKey]: err.message }));
        } finally {
            setLoading(prev => ({ ...prev, [setLoadingKey]: false }));
        }
    }, []);

    // Fetch inicial
    useEffect(() => {
        fetchData(`${API_BASE}/api/ouvidoria`, setMensagens, 'mensagens', 'mensagens', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData(`${API_BASE}/api/eventos`, setEventos, 'eventos', 'eventos');
        fetchData(`${API_BASE}/api/atividades`, setAtividades, 'atividades', 'atividades');
        fetchData(`${API_BASE}/api/documentos`, setDocumentos, 'documentos', 'documentos');
        fetchData(`${API_BASE}/api/metas`, setMetas, 'metas', 'metas');
        fetchData(`${API_BASE}/api/inscricoes`, setInscricoes, 'inscricoes', 'inscricoes', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }, [fetchData, token, API_BASE]);

    // Abrir/Fechar modais
    const openModal = (type, id) => setModalState(prev => ({ ...prev, [type]: id }));
    const closeModal = (type) => setModalState(prev => ({ ...prev, [type]: null }));

    // Função genérica para deletar
    const handleDelete = async (type, id) => {
        if (!window.confirm('Tem certeza que deseja apagar?')) return;
        try {
            const response = await fetch(`${API_BASE}/api/${type}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Erro ao apagar.');
            }
            // Atualiza a lista após deletar
            switch (type) {
                case 'atividades': fetchData(`${API_BASE}/api/atividades`, setAtividades, 'atividades', 'atividades'); break;
                case 'documentos': fetchData(`${API_BASE}/api/documentos`, setDocumentos, 'documentos', 'documentos'); break;
                case 'metas': fetchData(`${API_BASE}/api/metas`, setMetas, 'metas', 'metas'); break;
                case 'eventos': fetchData(`${API_BASE}/api/eventos`, setEventos, 'eventos', 'eventos'); break;
                default: break;
            }
        } catch (err) {
            alert(err.message);
        }
    };

    // Função genérica para criar
    const handleCreate = async (type, formData) => {
        try {
            const headers = type === 'atividade' || type === 'documento' 
                ? { 'Authorization': `Bearer ${token}` } 
                : { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
            
            const body = type === 'atividade' || type === 'documento' ? formData : JSON.stringify(formData);
            const response = await fetch(`${API_BASE}/api/${type === 'atividade' ? 'atividades' : type === 'documento' ? 'documentos' : type === 'meta' ? 'metas' : 'eventos'}`, { 
                method: 'POST', headers, body 
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro ao criar.');
            
            setForms(prev => ({ ...prev, [type]: { ...prev[type], success: 'Criado com sucesso!', error: '' } }));
            setForms(prev => ({ ...prev, [type]: { ...prev[type], titulo: '', descricao: '', data: '', local: '', valor: '', arquivo: null, imagens: [] } }));
            fetchData(`${API_BASE}/api/${type === 'atividade' ? 'atividades' : type === 'documento' ? 'documentos' : type === 'meta' ? 'metas' : 'eventos'}`, eval(`set${type.charAt(0).toUpperCase() + type.slice(1)}`), type, type);
        } catch (err) {
            setForms(prev => ({ ...prev, [type]: { ...prev[type], error: err.message, success: '' } }));
        }
    };

    return (
        <main className="admin-dashboard-wrapper">
            <h1>Painel de Administração</h1>
            <div className="admin-dashboard-container">
                <div className="admin-col-left">{/* Formulários */}</div>
                <div className="admin-col-right">{/* Listagens */}</div>
            </div>

            {/* Modais */}
            {modalState.atividade && <EditAtividadeModal atividadeId={modalState.atividade} onClose={() => closeModal('atividade')} onSave={() => fetchData(`${API_BASE}/api/atividades`, setAtividades, 'atividades', 'atividades')} />}
            {modalState.documento && <EditDocumentoModal documentoId={modalState.documento} onClose={() => closeModal('documento')} onSave={() => fetchData(`${API_BASE}/api/documentos`, setDocumentos, 'documentos', 'documentos')} />}
            {modalState.meta && <EditMetaModal metaId={modalState.meta} onClose={() => closeModal('meta')} onSave={() => fetchData(`${API_BASE}/api/metas`, setMetas, 'metas', 'metas')} />}
            {modalState.evento && <EditEventoModal eventoId={modalState.evento} onClose={() => closeModal('evento')} onSave={() => fetchData(`${API_BASE}/api/eventos`, setEventos, 'eventos', 'eventos')} />}
        </main>
    );
}

export default AdminPage;
