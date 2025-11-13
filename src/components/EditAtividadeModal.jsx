import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function EditAtividadeModal({ atividadeId, onClose, onSave }) {
  const { token } = useAuth(); 
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem1, setImagem1] = useState(null);
  const [imagem2, setImagem2] = useState(null);
  const [imagem3, setImagem3] = useState(null);
  const [imagem4, setImagem4] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  const [oldImages, setOldImages] = useState({});

  useEffect(() => {
    const fetchAtividade = async () => {
      setIsLoading(true);
      setFormError(''); 
      
      if (!token) {
        setFormError('Erro de autenticação: Token não disponível.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/atividades/${atividadeId}`, {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        });

        if (!response.ok) {
          const errorText = await response.text(); 
          let errorMessage = `Falha ao buscar dados. Status: ${response.status}.`;
          
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
          } catch (e) {
}

          throw new Error(errorMessage);
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
    };

    if(atividadeId && token) { 
      fetchAtividade();
    }
  }, [atividadeId, token]);


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
    
    if (imagem1) formData.append('imagem_1', imagem1);
    if (imagem2) formData.append('imagem_2', imagem2);
    if (imagem3) formData.append('imagem_3', imagem3);
    if (imagem4) formData.append('imagem_4', imagem4);

    try {
      const response = await fetch(`http://localhost:4000/api/atividades/${atividadeId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }, 
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao atualizar atividade');

      setFormSuccess(data.message); 
      onSave(); 
      
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
        <h2>Editar Atividade</h2>

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