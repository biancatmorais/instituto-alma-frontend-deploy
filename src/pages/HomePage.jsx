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
            {[1, 2, 3, 4].map(n => atividade[`imagem_url_${n}`] && (
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
  // JSX Principal (Mantendo seu design original)
  // -----------------------------
  return (
    <>
      {isModalOpen && <EventModal onClose={closeModal} />}
      <main>
        {/* --- Hero Section --- */}
        <section className="hero-section" id="home">
          <div className="hero-image-card">
            <div className="image-placeholder">
              <img src="/documentos/image.png" alt="Voluntária do Instituto Alma sorrindo" />
            </div>
            <div className="color-bars">
              <div className="bar" style={{ backgroundColor: '#f06678' }}></div>
              <div className="bar" style={{ backgroundColor: '#ffc9fc' }}></div>
              <div className="bar" style={{ backgroundColor: '#64B5F6' }}></div>
              <div className="bar" style={{ backgroundColor: '#6efff1' }}></div>
            </div>
          </div>
          <div className="hero-text">
            <h1>O Instituto Alma é uma luz de esperança nas comunidades mais esquecidas e vulneráveis da sociedade.</h1>
          </div>
        </section>

        <hr />

        {/* --- Sobre Nós Section --- */}
        <section id="sobre-nos" className="sobre-nos-section">
          <h2 className="section-title" style={{ display: 'none' }}>Sobre Nós</h2>
          <div className="thin-bar"></div>
          <div className="about-container">
            <div className="about-image-card">
              <img src="/documentos/Sopa 16.04.21 014.jpg" alt="Foto1" />
            </div>
            <div className="about-text-card">
              <h2>Sobre Nós</h2>
              <p>O instituto Alma surgiu com a proposta de promover a transformação social através de ações diferenciadas, feitas como objetivo de encantar e proporcionar algo único e especial para a vida das pessoas.</p>
              <p>O público-alvo são os moradores de comunidades muito carentes esquecidas.</p>
            </div>
            <div className="about-image-card">
              <img src="/documentos/Sopa 16.04.21 040.jpg" alt="Foto2" />
            </div>
          </div>
          <div className="bottom-color-bars">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bottom-bar" style={{ backgroundColor: slidesData[i % slidesData.length].barColor }}></div>
            ))}
          </div>
        </section>

        <hr />

        {/* --- Atividades Carrossel --- */}
        <section id="atividades" className="atividades-section">
          <h2 className="section-title">Nossas Atividades</h2>
          <div className="carousel-container">
            <div className="carousel-track">
              {renderAtividadesCarrossel()}
            </div>
            <div className="carousel-navigation">
              {renderCarrosselDots()}
            </div>
          </div>
        </section>

        <hr />

        {/* --- Portal de Transparência --- */}
        <section id="transparencia" className="transparencia-section">
          <h2 className="section-title">Portal de Transparência</h2>
          <div className="thin-bar" style={{ backgroundColor: '#6efff1' }}></div>
          <div className="transparencia-wrapper">
            <div className="transparencia-col-left">
              <div className="info-card">
                <p>Acreditamos na transparência total. Para que você acompanhe de perto como sua generosidade se transforma em ação, disponibilizamos nossos relatórios de atividades e financeiros.</p>
                <Link to="/relatorios" className="btn btn-red">Saiba Mais</Link>
              </div>
              <div className="info-card">
                <p>O Instituto Alma é feito por pessoas comprometidas com nossa missão. Conheça aqui nossos sócios, fundadores e a diretoria responsável pela gestão e governança da organização.</p>
                <Link to="/governanca" className="btn btn-red">Saiba Mais</Link>
              </div>
            </div>
            <div className="transparencia-col-right">
              <div className="info-card">
                <h3>Sua Confiança é Importante para Nós</h3>
                <p>No Instituto Alma, a transparência é o alicerce do nosso trabalho. Acreditamos que prestar contas de forma clara é fundamental para honrar a generosidade de quem nos apoia.</p>
              </div>
            </div>
          </div>
          <div className="bottom-color-bars">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bottom-bar" style={{ backgroundColor: slidesData[i % slidesData.length].barColor }}></div>
            ))}
          </div>
        </section>

        <hr />

        {/* --- Eventos --- */}
        <section id="eventos" className="eventos-section">
          <h2 className="section-title">Se Agende Para Participar Dos Nossos Eventos</h2>
          <div className="thin-bar" style={{ backgroundColor: '#6efff1' }}></div>
          <div className="eventos-wrapper">
            <div className="eventos-calendario">
              <h3>Dezembro 2025</h3>
              <table className="calendario-table">
                <thead>
                  <tr>
                    <th>Segunda-Feira</th>
                    <th>Terça-Feira</th>
                    <th>Quarta-Feira</th>
                    <th>Quinta-Feira</th>
                    <th>Sexta-Feira</th>
                    <th>Sábado</th>
                    <th>Domingo</th>
                  </tr>
                </thead>
                {/* Sua função renderCalendarioTable permanece */}
                <tbody>{/* Aqui você pode reutilizar renderCalendarioTable() */}</tbody>
              </table>
            </div>
            <div className="eventos-sidebar">
              <div className="sidebar-widget">
                <h4>Eventos em Breve:</h4>
                {renderEventosList()}
              </div>
              <div className="sidebar-widget">
                <h4>Seja notificado sobre nossos próximos eventos e participe!</h4>
                <button onClick={openModal} className="btn btn-red">Me Notifique</button>
              </div>
              <div className="sidebar-widget">
                <h4>Acomapnhe pelas redes:</h4>
                <div className="social-icons">
                  <a href="https://www.instagram.com/almainstituto_oficial" target="_blank" rel="noopener noreferrer" className="social-icon ig" title="Instagram">IG</a>
                  <a href="https://www.facebook.com/almainstituto.oficial" target="_blank" rel="noopener noreferrer" className="social-icon fb" title="Facebook">FB</a>
                  <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="social-icon yt" title="YouTube">YT</a>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-color-bars">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bottom-bar" style={{ backgroundColor: slidesData[i % slidesData.length].barColor }}></div>
            ))}
          </div>
        </section>

        <hr />

        {/* --- Ouvidoria --- */}
        <section id="ouvidoria" className="ouvidoria-section">
          <h2 className="section-title">Ouvidoria</h2>
          <div className="thin-bar" style={{ backgroundColor: '#6efff1' }}></div>
          <p className="ouvidoria-subtitle">TEM SUGESTÕES? RELATOS? RECLAMAÇÕES?</p>
          <p className="ouvidoria-subtitle last">FALE CONOSCO! ESTAMOS AQUI PARA TE OUVIR</p>
          <form onSubmit={handleSubmitOuvidoria} className="form-container">
            <div className="form-col-left">
              <div className="form-group">
                <label htmlFor="form-nome" className="form-label">Nome</label>
                <input type="text" id="form-nome" className="form-input" value={ouvidoriaNome} onChange={(e) => setOuvidoriaNome(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="form-email" className="form-label">Email</label>
                <input type="email" id="form-email" className="form-input" value={ouvidoriaEmail} onChange={(e) => setOuvidoriaEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="form-telefone" className="form-label">Telefone</label>
                <input type="tel" id="form-telefone" className="form-input" value={ouvidoriaTelefone} onChange={(e) => setOuvidoriaTelefone(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-red">Enviar</button>
              {formStatus && (
                <p style={{
                  marginTop: '20px',
                  fontWeight: '600',
                  color: formStatus.startsWith('Erro:') ? '#f06678' : '#6efff1'
                }}>{formStatus}</p>
              )}
            </div>
            <div className="form-col-right">
              <div className="form-group-textarea">
                <label htmlFor="form-mensagem" className="form-label">Escreva aqui:</label>
                <textarea id="form-mensagem" className="form-textarea" value={ouvidoriaMensagem} onChange={(e) => setOuvidoriaMensagem(e.target.value)} required></textarea>
              </div>
            </div>
          </form>
          <div className="bottom-color-bars">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bottom-bar" style={{ backgroundColor: slidesData[i % slidesData.length].barColor }}></div>
            ))}
          </div>
        </section>

      </main>
    </>
  );
}

export default HomePage;
