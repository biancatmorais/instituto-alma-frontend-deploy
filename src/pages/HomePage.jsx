import React, { useState, useEffect, useCallback } from 'react'; 
import { Link } from 'react-router-dom'; 
import EventModal from '../components/EventModal'; 

// Define a URL base da API lendo a variável de ambiente.
// Use 'http://localhost:4000' como fallback para desenvolvimento local.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

  const fetchEventos = useCallback(async () => {
    setIsLoadingEventos(true);
    try {
        // MUDANÇA 1: Rota de Eventos
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

  const fetchAtividades = useCallback(async () => {
    setIsLoadingAtividades(true);
    try {
        // MUDANÇA 2: Rota de Atividades
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

// ... (renderEventosList e renderCalendarioTable não precisam de alteração)

  const renderAtividadesCarrossel = () => {
    if (isLoadingAtividades) {
      return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>A carregar atividades...</div>;
    }
    if (errorAtividades) {
      return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Erro: {errorAtividades}</div>;
    }
    if (atividades.length === 0) {
// ... (Conteúdo de fallback da Sopa Fraterna)
      return (
        <div className={`carousel-slide active-slide`}>
          <div className="slide-top-bar" style={{ backgroundColor: '#6efff1' }}></div>
          <div className="slide-content-wrapper">
            <div className="image-grid">
              <div className="grid-image-placeholder"><img src="/documentos/Sopa 16.04.21 011.jpg" alt="Sopa Imagem 1" /></div>
              <div className="grid-image-placeholder"><img src="/documentos/Sopa 16.04.21 021.jpg" alt="Sopa Imagem 2" /></div>
              <div className="grid-image-placeholder"><img src="/documentos/Sopa 16.04.21 098.jpg" alt="Sopa Imagem 3" /></div>
              <div className="grid-image-placeholder"><img src="/documentos/Sopa 16.04.21 130.jpg" alt="Sopa Imagem 4" /></div>
            </div>
            <div className="description-panel">
              <h2>SOPA FRATERNA</h2>
              <div className="description-placeholder">
                <p>O Instituto Alma acredita no poder de um prato de comida quente para aquecer o corpo e o coração. Em nossa ação da "Sopa Fraterna", nossos voluntários se unem em um verdadeiro mutirão de solidariedade...</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // MUDANÇA 3: URL base das imagens dinâmicas
    const imageBaseUrl = `${API_BASE_URL}/uploads/`;

    return atividades.map((atividade, index) => (
      <div 
        key={atividade.id}
        className={`carousel-slide ${activeSlide === index ? 'active-slide' : ''}`}
      >
        <div className="slide-top-bar" style={{ backgroundColor: '#6efff1' }}></div>
        <div className="slide-content-wrapper">
          <div className="image-grid">
            {atividade.imagem_url_1 && (
              <div className="grid-image-placeholder">
                <img src={imageBaseUrl + atividade.imagem_url_1} alt={`${atividade.titulo} 1`} />
              </div>
            )}
            {atividade.imagem_url_2 && (
              <div className="grid-image-placeholder">
                <img src={imageBaseUrl + atividade.imagem_url_2} alt={`${atividade.titulo} 2`} />
              </div>
            )}
            {atividade.imagem_url_3 && (
              <div className="grid-image-placeholder">
                <img src={imageBaseUrl + atividade.imagem_url_3} alt={`${atividade.titulo} 3`} />
              </div>
            )}
            {atividade.imagem_url_4 && (
              <div className="grid-image-placeholder">
                <img src={imageBaseUrl + atividade.imagem_url_4} alt={`${atividade.titulo} 4`} />
              </div>
            )}
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

// ... (renderCarrosselDots não precisa de alteração)

  const handleSubmitOuvidoria = async (event) => {
    event.preventDefault(); 
    setFormStatus('Enviando...'); 
    const formData = {
      nome: ouvidoriaNome,
      email: ouvidoriaEmail,
      telefone: ouvidoriaTelefone,
      mensagem: ouvidoriaMensagem
    };
    try {
        // MUDANÇA 4: Rota de Ouvidoria
      const response = await fetch(`${API_BASE_URL}/api/ouvidoria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      setFormStatus('Erro: Não foi possível conectar ao servidor.');
    }
  };


  return (
    <> 
// ... (resto do componente sem alteração no JSX)
// ...
      {isModalOpen && <EventModal onClose={closeModal} />}

    </>
  );
}

export default HomePage;