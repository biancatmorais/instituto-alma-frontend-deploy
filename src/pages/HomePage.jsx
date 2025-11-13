import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import EventModal from '../components/EventModal';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

function HomePage() {
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

  const API_URL = process.env.REACT_APP_API_URL;

  // ------------------- FETCH EVENTOS -------------------
  const fetchEventos = useCallback(async () => {
    setIsLoadingEventos(true);
    try {
      const response = await fetch(`${API_URL}/api/eventos`);
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
  }, [API_URL]);

  // ------------------- FETCH ATIVIDADES -------------------
  const fetchAtividades = useCallback(async () => {
    setIsLoadingAtividades(true);
    try {
      const response = await fetch(`${API_URL}/api/atividades`);
      if (!response.ok) throw new Error('Falha ao buscar atividades');
      const data = await response.json();
      setAtividades(data);
      setErrorAtividades(null);
    } catch (err) {
      setErrorAtividades(err.message);
    } finally {
      setIsLoadingAtividades(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchEventos();
    fetchAtividades();
  }, [fetchEventos, fetchAtividades]);

  // ------------------- RENDER CALENDÁRIO -------------------
  const renderCalendarioTable = () => {
    const diasComEvento = new Set();
    const CALENDAR_MONTH = 11; // Dezembro
    const CALENDAR_YEAR = 2025;

    eventos.forEach(evento => {
      const dataEvento = new Date(evento.data_evento + 'T00:00:00');
      if (dataEvento.getMonth() === CALENDAR_MONTH && dataEvento.getFullYear() === CALENDAR_YEAR) {
        diasComEvento.add(dataEvento.getDate());
      }
    });

    const diasDoMes = 31;
    const cells = [];
    for (let dia = 1; dia <= diasDoMes; dia++) {
      const isEvento = diasComEvento.has(dia);
      cells.push(
        <td key={dia} className={isEvento ? 'dia-evento' : ''}><span>{dia}</span></td>
      );
    }

    [1, 2, 3, 4].forEach(dia => {
      cells.push(<td key={`prox-${dia}`} className="dia-desabilitado">{dia}</td>);
    });

    const rows = [];
    for (let i = 0; i < 5; i++) {
      rows.push(<tr key={i}>{cells.slice(i * 7, (i * 7) + 7)}</tr>);
    }
    return rows;
  };

  // ------------------- RENDER EVENTOS LIST -------------------
  const renderEventosList = () => {
    if (isLoadingEventos) return <div className="evento-info-box">A carregar eventos...</div>;
    if (errorEventos) return <div className="evento-info-box" style={{ color: 'red' }}>{errorEventos}</div>;

    const proximoEvento = eventos[0];
    if (!proximoEvento) {
      return (
        <div className="evento-info-box">
          <strong>Nenhum evento futuro agendado.</strong><br />
          <span style={{ fontSize: '0.85em', opacity: 0.7 }}>Verifique a seção de notícias para eventos passados.</span>
        </div>
      );
    }

    return (
      <div className="evento-info-box">
        <strong>{formatDate(proximoEvento.data_evento)} - {proximoEvento.titulo}</strong><br />
        <strong>Local:</strong> {proximoEvento.local}<br />
        <span style={{ fontSize: '0.85em', opacity: 0.9 }}>{proximoEvento.descricao}</span>
      </div>
    );
  };

  // ------------------- RENDER CARROSSEL ATIVIDADES -------------------
  const renderAtividadesCarrossel = () => {
    if (isLoadingAtividades) return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>A carregar atividades...</div>;
    if (errorAtividades) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Erro: {errorAtividades}</div>;

    if (atividades.length === 0) {
      return (
        <div className={`carousel-slide active-slide`}>
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

    const imageBaseUrl = `${API_URL}/uploads/`;
    return atividades.map((atividade, index) => (
      <div key={atividade.id} className={`carousel-slide ${activeSlide === index ? 'active-slide' : ''}`}>
        <div className="slide-top-bar" style={{ backgroundColor: slidesData[index % slidesData.length].barColor }}></div>
        <div className="slide-content-wrapper">
          <div className="image-grid">
            {[atividade.imagem_url_1, atividade.imagem_url_2, atividade.imagem_url_3, atividade.imagem_url_4].map((img, i) => (
              img ? <div key={i} className="grid-image-placeholder"><img src={imageBaseUrl + img} alt={`${atividade.titulo} ${i + 1}`} /></div> : null
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

  const renderCarrosselDots = () => {
    const items = atividades.length > 0 ? atividades : slidesData;
    return items.map((item, index) => (
      <div key={item.id || index} className={`nav-dot ${activeSlide === index ? 'active-dot' : ''}`} style={{ backgroundColor: slidesData[index % slidesData.length].barColor }} onClick={() => setActiveSlide(index)} />
    ));
  };

  // ------------------- HANDLE SUBMIT OUVIDORIA -------------------
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
      const data = await response.json();
      if (response.ok) {
        setFormStatus(data.message);
        setOuvidoriaNome(''); setOuvidoriaEmail(''); setOuvidoriaTelefone(''); setOuvidoriaMensagem('');
      } else setFormStatus(`Erro: ${data.message}`);
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      setFormStatus('Erro: Não foi possível conectar ao servidor.');
    }
  };

  // ------------------- RENDER HOME -------------------
  return (
    <>
      {isModalOpen && <EventModal onClose={closeModal} />}
      <main>
        {/* HERO */}
        <section className="hero-section" id="home">
          <div className="hero-image-card">
            <div className="image-placeholder"><img src="/documentos/image.png" alt="Voluntária do Instituto Alma sorrindo" /></div>
            <div className="color-bars">
              {slidesData.map((s, i) => <div key={i} className="bar" style={{ backgroundColor: s.barColor }}></div>)}
            </div>
          </div>
          <div className="hero-text">
            <h1>O Instituto Alma é uma luz de esperança nas comunidades mais esquecidas e vulneráveis da sociedade.</h1>
          </div>
        </section>

        <hr/>

        {/* SOBRE NÓS */}
        <section id="sobre-nos" className="sobre-nos-section">
          <div className="about-container">
            <div className="about-image-card"><img src="/documentos/Sopa 16.04.21 014.jpg" alt="Foto1" /></div>
            <div className="about-text-card">
              <h2>Sobre Nós</h2>
              <p>O instituto Alma surgiu com a proposta de promover a transformação social através de ações diferenciadas...</p>
            </div>
            <div className="about-image-card"><img src="/documentos/Sopa 16.04.21 040.jpg" alt="Foto2" /></div>
          </div>
          <div className="bottom-color-bars">
            {slidesData.map((s, i) => <div key={i} className="bottom-bar" style={{ backgroundColor: s.barColor }}></div>)}
          </div>
        </section>

        <hr/>

        {/* ATIVIDADES CARROSSEL */}
        <section id="atividades" className="atividades-section">
          <h2 className="section-title">Nossas Atividades</h2>
          <div className="carousel-container">
            <div className="carousel-track">{renderAtividadesCarrossel()}</div>
            <div className="carousel-navigation">{renderCarrosselDots()}</div>
          </div>
        </section>

        <hr/>

        {/* PORTAL DE TRANSPARÊNCIA */}
        <section id="transparencia" className="transparencia-section">
          <h2 className="section-title">Portal de Transparência</h2>
          <div className="thin-bar" style={{ backgroundColor: '#6efff1' }}></div>
          <div className="transparencia-wrapper">
            <div className="transparencia-col-left">
              <div className="info-card">
                <p>Acreditamos na transparência total...</p>
                <Link to="/relatorios" className="btn btn-red">Saiba Mais</Link>
              </div>
            </div>
          </div>
        </section>

        <hr/>

        {/* EVENTOS */}
        <section id="eventos" className="eventos-section">
          <h2 className="section-title">Se Agende Para Participar Dos Nossos Eventos</h2>
          <div className="thin-bar" style={{ backgroundColor: '#6efff1' }}></div>
          <div className="eventos-wrapper">
            <div className="eventos-calendario">
              <h3>Dezembro 2025</h3>
              <table className="calendario-table">
                <thead>
                  <tr>
                    <th>Segunda-Feira</th><th>Terça-Feira</th><th>Quarta-Feira</th>
                    <th>Quinta-Feira</th><th>Sexta-Feira</th><th>Sábado</th><th>Domingo</th>
                  </tr>
                </thead>
                <tbody>{renderCalendarioTable()}</tbody>
              </table>
            </div>
            <div className="eventos-sidebar">
              <div className="sidebar-widget"><h4>Eventos em Breve:</h4>{renderEventosList()}</div>
              <div className="sidebar-widget"><h4>Seja notificado sobre nossos próximos eventos e participe!</h4>
                <button onClick={openModal} className="btn btn-red">Me Notifique</button>
              </div>
            </div>
          </div>
        </section>

        <hr/>

        {/* OUVIDORIA */}
        <section id="ouvidoria" className="ouvidoria-section">
          <h2 className="section-title">Ouvidoria</h2>
          <div className="thin-bar" style={{ backgroundColor: '#6efff1' }}></div>
          <form onSubmit={handleSubmitOuvidoria} className="form-container">
            <div className="form-col-left">
              <input type="text" placeholder="Nome" value={ouvidoriaNome} onChange={(e) => setOuvidoriaNome(e.target.value)} required />
              <input type="email" placeholder="Email" value={ouvidoriaEmail} onChange={(e) => setOuvidoriaEmail(e.target.value)} required />
              <input type="tel" placeholder="Telefone" value={ouvidoriaTelefone} onChange={(e) => setOuvidoriaTelefone(e.target.value)} />
              <button type="submit" className="btn btn-red">Enviar</button>
              {formStatus && <p style={{ color: formStatus.startsWith('Erro:') ? '#f06678' : '#6efff1' }}>{formStatus}</p>}
            </div>
            <div className="form-col-right">
              <textarea placeholder="Mensagem" value={ouvidoriaMensagem} onChange={(e) => setOuvidoriaMensagem(e.target.value)} required />
            </div>
          </form>
        </section>

      </main>
    </>
  );
}

export default HomePage;