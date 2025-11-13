// HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import EventModal from '../components/EventModal';

// URL da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://instituto-alma-backend-azure-production.up.railway.app';

// Função utilitária para formatar datas
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [ouvidoriaNome, setOuvidoriaNome] = useState('');
  const [ouvidoriaEmail, setOuvidoriaEmail] = useState('');
  const [ouvidoriaTelefone, setOuvidoriaTelefone] = useState('');
  const [ouvidoriaMensagem, setOuvidoriaMensagem] = useState('');
  const [formStatus, setFormStatus] = useState('');

  const [eventos, setEventos] = useState([]);
  const [isLoadingEventos, setIsLoadingEventos] = useState(true);
  const [errorEventos, setErrorEventos] = useState(null);

  const [atividades, setAtividades] = useState([]);
  const [isLoadingAtividades, setIsLoadingAtividades] = useState(true);
  const [errorAtividades, setErrorAtividades] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchEventos = useCallback(async () => {
    setIsLoadingEventos(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/eventos`);
      if (!response.ok) throw new Error('Falha ao buscar eventos');
      const data = await response.json();
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const eventosFuturos = data
        .filter(ev => new Date(ev.data_evento) >= hoje)
        .sort((a, b) => new Date(a.data_evento) - new Date(b.data_evento));
      setEventos(eventosFuturos);
      setErrorEventos(null);
    } catch (err) {
      setErrorEventos(err.message);
    } finally {
      setIsLoadingEventos(false);
    }
  }, []);

  const fetchAtividades = useCallback(async () => {
    setIsLoadingAtividades(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/atividades`);
      if (!response.ok) throw new Error('Falha ao buscar atividades');
      const data = await response.json();
      setAtividades(data);
      setErrorAtividades(null);
    } catch (err) {
      setErrorAtividades(err.message);
    } finally {
      setIsLoadingAtividades(false);
    }
  }, []);

  useEffect(() => {
    fetchEventos();
    fetchAtividades();
  }, [fetchEventos, fetchAtividades]);

  const renderAtividadesCarrossel = () => {
    if (isLoadingAtividades) return <div className="loading">Carregando atividades...</div>;
    if (errorAtividades) return <div className="error">{errorAtividades}</div>;
    if (atividades.length === 0) {
      // Renderiza slide default
      return (
        <div className="carousel-slide active-slide">
          <div className="slide-top-bar" style={{ backgroundColor: '#6efff1' }}></div>
          <div className="slide-content-wrapper">
            <div className="image-grid">
              <div className="grid-image-placeholder"><img src="/documentos/Sopa 16.04.21 011.jpg" alt="Sopa 1" /></div>
              <div className="grid-image-placeholder"><img src="/documentos/Sopa 16.04.21 021.jpg" alt="Sopa 2" /></div>
              <div className="grid-image-placeholder"><img src="/documentos/Sopa 16.04.21 098.jpg" alt="Sopa 3" /></div>
              <div className="grid-image-placeholder"><img src="/documentos/Sopa 16.04.21 130.jpg" alt="Sopa 4" /></div>
            </div>
            <div className="description-panel">
              <h2>SOPA FRATERNA</h2>
              <div className="description-placeholder">
                <p>O Instituto Alma acredita no poder de um prato de comida quente para aquecer o corpo e o coração...</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const imageBaseUrl = `${API_BASE_URL}/uploads/`;
    return atividades.map((atividade, index) => (
      <div key={atividade.id} className={`carousel-slide ${activeSlide === index ? 'active-slide' : ''}`}>
        <div className="slide-top-bar" style={{ backgroundColor: '#6efff1' }}></div>
        <div className="slide-content-wrapper">
          <div className="image-grid">
            {atividade.imagem_url_1 && <div className="grid-image-placeholder"><img src={imageBaseUrl + atividade.imagem_url_1} alt={`${atividade.titulo} 1`} /></div>}
            {atividade.imagem_url_2 && <div className="grid-image-placeholder"><img src={imageBaseUrl + atividade.imagem_url_2} alt={`${atividade.titulo} 2`} /></div>}
            {atividade.imagem_url_3 && <div className="grid-image-placeholder"><img src={imageBaseUrl + atividade.imagem_url_3} alt={`${atividade.titulo} 3`} /></div>}
            {atividade.imagem_url_4 && <div className="grid-image-placeholder"><img src={imageBaseUrl + atividade.imagem_url_4} alt={`${atividade.titulo} 4`} /></div>}
          </div>
          <div className="description-panel">
            <h2>{atividade.titulo.toUpperCase()}</h2>
            <div className="description-placeholder">
              <p style={{ whiteSpace: 'pre-wrap' }}>{atividade.descricao}</p>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const handleSubmitOuvidoria = async (e) => {
    e.preventDefault();
    setFormStatus('Enviando...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/ouvidoria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: ouvidoriaNome,
          email: ouvidoriaEmail,
          telefone: ouvidoriaTelefone,
          mensagem: ouvidoriaMensagem
        })
      });
      const data = await response.json();
      if (response.ok) {
        setFormStatus(data.message);
        setOuvidoriaNome('');
        setOuvidoriaEmail('');
        setOuvidoriaTelefone('');
        setOuvidoriaMensagem('');
      } else {
        setFormStatus(`Erro: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setFormStatus('Erro: Não foi possível conectar ao servidor.');
    }
  };

  return (
    <>
      {/* Mantém layout original, apenas renderizando slides e modal */}
      {renderAtividadesCarrossel()}
      {isModalOpen && <EventModal onClose={closeModal} />}
    </>
  );
}

export default HomePage;
