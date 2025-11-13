import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import EventModal from '../components/EventModal';

// URL dinâmica — pega do .env no Vercel ou usa Railway
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://instituto-alma-backend-azure-production.up.railway.app';

// Função utilitária para formatar datas (dd/mm)
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

  // 🔹 Fetch de eventos
  const fetchEventos = useCallback(async () => {
    setIsLoadingEventos(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/eventos`);
      if (!response.ok) throw new Error('Falha ao buscar eventos do servidor');
      const data = await response.json();

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const eventosFuturos = data
        .filter(evento => new Date(evento.data_evento) >= hoje)
        .sort((a, b) => new Date(a.data_evento) - new Date(b.data_evento));

      setEventos(eventosFuturos);
      setErrorEventos(null);
    } catch (err) {
      setErrorEventos(err.message);
    } finally {
      setIsLoadingEventos(false);
    }
  }, []);

  // 🔹 Fetch de atividades
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

    // Carrossel automático
    const timer = setInterval(() => {
      setActiveSlide(prev => (atividades.length ? (prev + 1) % atividades.length : 0));
    }, 5000);

    return () => clearInterval(timer);
  }, [fetchEventos, fetchAtividades, atividades.length]);

  // 🔹 Carrossel de atividades
  const renderAtividadesCarrossel = () => {
    if (isLoadingAtividades) return <div className="loading">Carregando atividades...</div>;
    if (errorAtividades) return <div className="error">Erro: {errorAtividades}</div>;

    const imageBaseUrl = `${API_BASE_URL}/uploads/`;

    if (atividades.length === 0) {
      // Fallback com imagens estáticas
      return (
        <div className="carousel-slide active-slide">
          <div className="slide-top-bar" style={{ backgroundColor: '#6efff1' }}></div>
          <div className="slide-content-wrapper">
            <div className="image-grid">
              <img src="/documentos/Sopa 16.04.21 011.jpg" alt="Sopa 1" />
              <img src="/documentos/Sopa 16.04.21 021.jpg" alt="Sopa 2" />
              <img src="/documentos/Sopa 16.04.21 098.jpg" alt="Sopa 3" />
              <img src="/documentos/Sopa 16.04.21 130.jpg" alt="Sopa 4" />
            </div>
            <div className="description-panel">
              <h2>SOPA FRATERNA</h2>
              <p>O Instituto Alma acredita no poder de um prato de comida quente para aquecer o corpo e o coração...</p>
            </div>
          </div>
        </div>
      );
    }

    return atividades.map((atividade, index) => (
      <div key={atividade.id} className={`carousel-slide ${activeSlide === index ? 'active-slide' : ''}`}>
        <div className="slide-top-bar" style={{ backgroundColor: '#6efff1' }}></div>
        <div className="slide-content-wrapper">
          <div className="image-grid">
            {atividade.imagem_url_1 && <img src={imageBaseUrl + atividade.imagem_url_1} alt={`${atividade.titulo} 1`} />}
            {atividade.imagem_url_2 && <img src={imageBaseUrl + atividade.imagem_url_2} alt={`${atividade.titulo} 2`} />}
            {atividade.imagem_url_3 && <img src={imageBaseUrl + atividade.imagem_url_3} alt={`${atividade.titulo} 3`} />}
            {atividade.imagem_url_4 && <img src={imageBaseUrl + atividade.imagem_url_4} alt={`${atividade.titulo} 4`} />}
          </div>
          <div className="description-panel">
            <h2>{atividade.titulo.toUpperCase()}</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{atividade.descricao}</p>
          </div>
        </div>
      </div>
    ));
  };

  // 🔹 Próximos eventos
  const renderEventos = () => {
    if (isLoadingEventos) return <div className="loading">Carregando eventos...</div>;
    if (errorEventos) return <div className="error">Erro: {errorEventos}</div>;
    if (eventos.length === 0) return <div className="no-events">Sem eventos futuros</div>;

    return (
      <div className="events-list">
        {eventos.map(evento => (
          <div key={evento.id} className="event-card">
            <h3>{evento.titulo}</h3>
            <p>{formatDate(evento.data_evento)}</p>
            <p>{evento.local}</p>
            <button onClick={openModal}>Mais detalhes</button>
          </div>
        ))}
      </div>
    );
  };

  // 🔹 Enviar ouvidoria
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
      setFormStatus('Erro: Não foi possível conectar ao servidor.');
    }
  };

  return (
    <main className="home-page">
      {/* Carrossel */}
      {renderAtividadesCarrossel()}

      {/* Próximos eventos */}
      <section className="events-section">
        <h2>Próximos Eventos</h2>
        {renderEventos()}
      </section>

      {/* Formulário de ouvidoria */}
      <section className="ouvidoria-section">
        <h2>Entre em Contato</h2>
        <form onSubmit={handleSubmitOuvidoria}>
          {formStatus && <p className="form-status">{formStatus}</p>}
          <input type="text" placeholder="Nome" value={ouvidoriaNome} onChange={e => setOuvidoriaNome(e.target.value)} required />
          <input type="email" placeholder="Email" value={ouvidoriaEmail} onChange={e => setOuvidoriaEmail(e.target.value)} required />
          <input type="tel" placeholder="Telefone" value={ouvidoriaTelefone} onChange={e => setOuvidoriaTelefone(e.target.value)} />
          <textarea placeholder="Mensagem" value={ouvidoriaMensagem} onChange={e => setOuvidoriaMensagem(e.target.value)} required />
          <button type="submit">Enviar</button>
        </form>
      </section>

      {/* Modais */}
      {isModalOpen && <EventModal onClose={closeModal} />}
    </main>
  );
}

export default HomePage;
