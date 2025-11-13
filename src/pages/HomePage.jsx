import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import EventModal from '../components/EventModal';

// Formata datas para dd/mm
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

function HomePage() {
  // -----------------------------
  // Constantes e Estado
  // -----------------------------
  const API_URL = process.env.REACT_APP_API_URL;

  const [activeSlide, setActiveSlide] = useState(0);
  const slidesData = [
    { id: 0, barColor: '#f06678' },
    { id: 1, barColor: '#ffc9fc' },
    { id: 2, barColor: '#64B5F6' },
    { id: 3, barColor: '#6efff1' },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Ouvidoria
  const [ouvidoriaNome, setOuvidoriaNome] = useState('');
  const [ouvidoriaEmail, setOuvidoriaEmail] = useState('');
  const [ouvidoriaTelefone, setOuvidoriaTelefone] = useState('');
  const [ouvidoriaMensagem, setOuvidoriaMensagem] = useState('');
  const [formStatus, setFormStatus] = useState('');

  // Eventos
  const [eventos, setEventos] = useState([]);
  const [isLoadingEventos, setIsLoadingEventos] = useState(true);
  const [errorEventos, setErrorEventos] = useState(null);

  // Atividades
  const [atividades, setAtividades] = useState([]);
  const [isLoadingAtividades, setIsLoadingAtividades] = useState(true);
  const [errorAtividades, setErrorAtividades] = useState(null);

  // -----------------------------
  // Fetch de Eventos
  // -----------------------------
  const fetchEventos = useCallback(async () => {
    setIsLoadingEventos(true);
    try {
      const response = await fetch(`${API_URL}/api/eventos`);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Resposta não é JSON. Verifique se a API está online.');
      }

      const data = await response.json();

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const eventosFuturos = data
        .filter((evento) => new Date(evento.data_evento) >= hoje)
        .sort((a, b) => new Date(a.data_evento) - new Date(b.data_evento));

      setEventos(eventosFuturos);
      setErrorEventos(null);
    } catch (err) {
      setErrorEventos(err.message);
    } finally {
      setIsLoadingEventos(false);
    }
  }, [API_URL]);

  // -----------------------------
  // Fetch de Atividades
  // -----------------------------
  const fetchAtividades = useCallback(async () => {
    setIsLoadingAtividades(true);
    try {
      const response = await fetch(`${API_URL}/api/atividades`);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Resposta não é JSON. Verifique se a API está online.');
      }

      const data = await response.json();
      setAtividades(data);
      setErrorAtividades(null);
    } catch (err) {
      setErrorAtividades(err.message);
    } finally {
      setIsLoadingAtividades(false);
    }
  }, [API_URL]);

  // -----------------------------
  // useEffect inicial
  // -----------------------------
  useEffect(() => {
    fetchEventos();
    fetchAtividades();
  }, [fetchEventos, fetchAtividades]);

  // -----------------------------
  // Render Eventos
  // -----------------------------
  const renderEventosList = () => {
    if (isLoadingEventos) return <div className="evento-info-box">A carregar eventos...</div>;
    if (errorEventos) return <div className="evento-info-box" style={{ color: 'red' }}>{errorEventos}</div>;

    const proximoEvento = eventos[0];
    if (!proximoEvento) return (
      <div className="evento-info-box">
        <strong>Nenhum evento futuro agendado.</strong><br />
        <span style={{ fontSize: '0.85em', opacity: 0.7 }}>Verifique a seção de notícias para eventos passados.</span>
      </div>
    );

    return (
      <div className="evento-info-box">
        <strong>{formatDate(proximoEvento.data_evento)} - {proximoEvento.titulo}</strong><br />
        <strong>Local:</strong> {proximoEvento.local}<br />
        <span style={{ fontSize: '0.85em', opacity: 0.9 }}>{proximoEvento.descricao}</span>
      </div>
    );
  };

  // -----------------------------
  // Render Atividades Carrossel
  // -----------------------------
  const renderAtividadesCarrossel = () => {
    if (isLoadingAtividades) return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>A carregar atividades...</div>;
    if (errorAtividades) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Erro: {errorAtividades}</div>;
    if (atividades.length === 0) return <div className={`carousel-slide active-slide`}><p>Sem atividades disponíveis.</p></div>;

    const imageBaseUrl = `${API_URL}/uploads/`;

    return atividades.map((atividade, index) => (
      <div key={atividade.id} className={`carousel-slide ${activeSlide === index ? 'active-slide' : ''}`}>
        <div className="slide-top-bar" style={{ backgroundColor: slidesData[index % slidesData.length].barColor }}></div>
        <div className="slide-content-wrapper">
          <div className="image-grid">
            {[1,2,3,4].map(n => atividade[`imagem_url_${n}`] && (
              <div key={n} className="grid-image-placeholder">
                <img src={`${imageBaseUrl}${atividade[`imagem_url_${n}`]}`} alt={`${atividade.titulo} ${n}`} />
              </div>
            ))}
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

  // -----------------------------
  // Carrossel Dots
  // -----------------------------
  const renderCarrosselDots = () => {
    const items = atividades.length > 0 ? atividades : slidesData;
    return items.map((item, index) => (
      <div
        key={item.id || index}
        className={`nav-dot ${activeSlide === index ? 'active-dot' : ''}`}
        style={{ backgroundColor: slidesData[index % slidesData.length].barColor }}
        onClick={() => setActiveSlide(index)}
      />
    ));
  };

  // -----------------------------
  // Handle Ouvidoria
  // -----------------------------
  const handleSubmitOuvidoria = async (event) => {
    event.preventDefault();
    setFormStatus('Enviando...');
    const formData = { nome: ouvidoriaNome, email: ouvidoriaEmail, telefone: ouvidoriaTelefone, mensagem: ouvidoriaMensagem };

    try {
      const response = await fetch(`${API_URL}/api/ouvidoria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Resposta da ouvidoria não é JSON.');
      }

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
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      setFormStatus('Erro: Não foi possível conectar ao servidor.');
    }
  };

  // -----------------------------
  // JSX Principal
  // -----------------------------
  return (
    <>
      {isModalOpen && <EventModal onClose={closeModal} />}
      <main>
        {/* Aqui você mantém toda a renderização das seções conforme seu código original */}
        {/* Por exemplo: Hero, Sobre Nós, Atividades (com renderAtividadesCarrossel), Eventos (com renderEventosList), Ouvidoria, etc. */}
        {/* Basta substituir os fetches anteriores pelos revisados acima */}
      </main>
    </>
  );
}

export default HomePage;
