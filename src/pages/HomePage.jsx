import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import EventModal from '../components/EventModal.jsx'; 

// Define a URL base da API
// Correção final: Usa process.env.RAILWAY_API_URL para forçar a leitura da variável de ambiente Vercel
const API_URL = process.env.RAILWAY_API_URL || 'https://instituto-alma-backend-azure-production.up.railway.app';

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

    // Estados do formulário de Ouvidoria
    const [ouvidoriaNome, setOuvidoriaNome] = useState('');
    const [ouvidoriaEmail, setOuvidoriaEmail] = useState('');
    const [ouvidoriaTelefone, setOuvidoriaTelefone] = useState('');
    const [ouvidoriaMensagem, setOuvidoriaMensagem] = useState('');
    const [formStatus, setFormStatus] = useState(''); 

    // Estados de dados
    const [eventos, setEventos] = useState([]);
    const [isLoadingEventos, setIsLoadingEventos] = useState(true);
    const [errorEventos, setErrorEventos] = useState(null);
    
    const [atividades, setAtividades] = useState([]); 
    const [isLoadingAtividades, setIsLoadingAtividades] = useState(true);
    const [errorAtividades, setErrorAtividades] = useState(null);

    // -------------------------------------------------------------
    // --- FUNÇÕES DE FETCH (Buscam dados da API) ---
    // -------------------------------------------------------------

    const fetchEventos = useCallback(async () => {
        setIsLoadingEventos(true);
        try {
            // CORRIGIDO: Usa a variável API_URL
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

    const fetchAtividades = useCallback(async () => {
        setIsLoadingAtividades(true);
        try {
            // CORRIGIDO: Usa a variável API_URL
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

    // -------------------------------------------------------------
    // --- FUNÇÕES DE RENDERIZAÇÃO (Para o JSX) ---
    // -------------------------------------------------------------

    const renderEventosList = () => {
        if (isLoadingEventos) {
            return <div className="evento-info-box">A carregar eventos...</div>;
        }
        if (errorEventos) {
            return <div className="evento-info-box" style={{ color: 'red' }}>{errorEventos}</div>;
        }
        
        const proximoEvento = eventos[0]; 
        
        if (!proximoEvento) {
            return (
                <div className="evento-info-box">
                    <strong>Nenhum evento futuro agendado.</strong><br />
                    <span style={{fontSize: '0.85em', opacity: 0.7}}>Verifique a seção de notícias para eventos passados.</span>
                </div>
            );
        }
        
        return (
            <div className="evento-info-box">
                <strong>{formatDate(proximoEvento.data_evento)} - {proximoEvento.titulo}</strong><br />
                <strong>Local:</strong> {proximoEvento.local}<br />
                <span style={{fontSize: '0.85em', opacity: 0.9}}>{proximoEvento.descricao}</span>
            </div>
        );
    };
    
    const renderCalendarioTable = () => {
        const diasComEvento = new Set();
        
        const CALENDAR_MONTH = 11; 
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
            const cellContent = isEvento 
                ? <td key={dia} className="dia-evento"><span>{dia}</span></td>
                : <td key={dia}>{dia}</td>;
            cells.push(cellContent);
        }
        
        const diasDesabilitados = [1, 2, 3, 4];
        diasDesabilitados.forEach(dia => {
            cells.push(<td key={`prox-${dia}`} className="dia-desabilitado">{dia}</td>);
        });
        
        const rows = [];
        for (let i = 0; i < 5; i++) {
            rows.push(
                <tr key={i}>
                    {cells.slice(i * 7, (i * 7) + 7)}
                </tr>
            );
        }

        return <tbody>{rows}</tbody>;
    };

    const renderAtividadesCarrossel = () => {
        if (isLoadingAtividades) {
            return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>A carregar atividades...</div>;
        }
        if (errorAtividades) {
            return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Erro: {errorAtividades}</div>;
        }
        // Se a API não retornar dados, renderiza um placeholder (como você previu na lógica)
        if (atividades.length === 0) {
            return (
                <div className={`carousel-slide active-slide`}>
                    <div className="slide-top-bar" style={{ backgroundColor: '#6efff1' }}></div>
                    <div className="slide-content-wrapper">
                        <div className="image-grid">
                            {/* Placeholder images based on the old design/images provided */}
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

        const imageBaseUrl = `${API_URL}/uploads/`;

        return atividades.map((atividade, index) => (
            <div 
                key={atividade.id}
                className={`carousel-slide ${activeSlide === index ? 'active-slide' : ''}`}
            >
                {/* Usa slidesData para a cor, assumindo que são apenas 4 slides */}
                <div className="slide-top-bar" style={{ backgroundColor: slidesData[index % slidesData.length].barColor }}></div>
                <div className="slide-content-wrapper">
                    <div className="image-grid">
                        {/* Imagens vêm da API */}
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

    const renderCarrosselDots = () => {
        const colors = ['#f06678', '#ffc9fc', '#64B5F6', '#6efff1'];
        
        const items = atividades.length > 0 ? atividades : slidesData; 

        return items.map((item, index) => (
            <div 
                key={item.id || index} 
                className={`nav-dot ${activeSlide === index ? 'active-dot' : ''}`}
                style={{ backgroundColor: colors[index % colors.length] }}
                onClick={() => setActiveSlide(index)} 
            />
        ));
    };


    // -------------------------------------------------------------
    // --- FUNÇÃO DE SUBMISSÃO (Ouvidoria) ---
    // -------------------------------------------------------------
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
            // CORRIGIDO: Usa a variável API_URL
            const response = await fetch(`${API_URL}/api/ouvidoria`, {
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
            {/* O componente EventModal é renderizado sobre o conteúdo principal se isModalOpen for true */}
            {isModalOpen && <EventModal onClose={closeModal} />}

            {/* --- NOVO: CABEÇALHO/NAVEGAÇÃO (REMOVIDO CÓDIGO DUPLICADO) --- */}
            
            <main>

                {/* 1. SEÇÃO HERO / HOME */}
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
                
                <hr/>

                {/* 2. SEÇÃO SOBRE NÓS */}
                <section id="sobre-nos" className="sobre-nos-section">
                    <h2 className="section-title" style={{ display: 'none' }}>Sobre Nós</h2>
                    <div className="thin-bar"></div>
                    <div className="about-container">
                        <div className="about-image-card">
                            <img src="/documentos/Sopa 16.04.21 014.jpg" alt="Foto1" />
                        </div>
                        <div className="about-text-card">
                            <h2>Sobre Nós</h2>
                            <p>O instituto Alma surgiu com a proposta de
                                promover a transformação social através de
                                ações diferenciadas, feitas como objetivo de
                                encantar e proporcionar algo único e especial
                                para a vida das pessoas.</p>
                            <p>O público-alvo são os moradores de comunidades
                                muito carentes esquecidas.</p>
                        </div>
                        <div className="about-image-card">
                            <img src="/documentos/Sopa 16.04.21 040.jpg" alt="Foto2" />
                        </div>
                    </div>
                    <div className="bottom-color-bars">
                        <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#6efff1' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
                    </div>
                </section>

                <hr/>

                {/* 3. SEÇÃO NOSSAS ATIVIDADES (CARROSSEL) */}
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

                <hr/>

                {/* 4. SEÇÃO PORTAL DE TRANSPARÊNCIA */}
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
                                <p>Temos um compromisso firme com a gestão responsável de todos os recursos. Cada doação recebida é registrada e direcionada com o máximo cuidado para nossas ações, seja na compra de alimentos para a Sopa Fraterna, na montagem das cestas básicas ou no apoio às mães.</p>
                                <p>Seu apoio nos permite levar dignidade e esperança, e é por isso que fazemos questão de sermos transparentes sobre como sua contribuição se transforma em ajuda real.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-color-bars">
                        <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#6efff1' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
                    </div>
                </section>

                <hr/>

                {/* 5. SEÇÃO EVENTOS (CALENDÁRIO) */}
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
                                {renderCalendarioTable()}
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
                        <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#6efff1' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
                    </div>
                </section>

                <hr/>

                {/* 6. SEÇÃO OUVIDORIA */}
                <section id="ouvidoria" className="ouvidoria-section">
                    <h2 className="section-title">Ouvidoria</h2>
                    <div className="thin-bar" style={{ backgroundColor: '#6efff1' }}></div>
                    <p className="ouvidoria-subtitle">TEM SUGESTÕES? RELATOS? RECLAMAÇÕES?</p>
                    <p className="ouvidoria-subtitle last">FALE CONOSCO! ESTAMOS AQUI PARA TE OUVIR</p>
                    <form onSubmit={handleSubmitOuvidoria} className="form-container">
                        <div className="form-col-left">
                            <div className="form-group">
                                <label htmlFor="form-nome" className="form-label">Nome</label>
                                <input
                                    type="text"
                                    id="form-nome"
                                    className="form-input"
                                    value={ouvidoriaNome}
                                    onChange={(e) => setOuvidoriaNome(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="form-email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    id="form-email"
                                    className="form-input"
                                    value={ouvidoriaEmail}
                                    onChange={(e) => setOuvidoriaEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="form-telefone" className="form-label">Telefone</label>
                                <input
                                    type="tel"
                                    id="form-telefone"
                                    className="form-input"
                                    value={ouvidoriaTelefone}
                                    onChange={(e) => setOuvidoriaTelefone(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-red">Enviar</button>

                            {formStatus && (
                                <p style={{
                                    marginTop: '20px',
                                    fontWeight: '600',
                                    color: formStatus.startsWith('Erro:') ? '#f06678' : '#6efff1'
                                }}>
                                    {formStatus}
                                </p>
                            )}

                        </div>
                        <div className="form-col-right">
                            <div className="form-group-textarea">
                                <label htmlFor="form-mensagem" className="form-label">Escreva aqui:</label>
                                <textarea
                                    id="form-mensagem"
                                    className="form-textarea"
                                    value={ouvidoriaMensagem}
                                    onChange={(e) => setOuvidoriaMensagem(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </form>
                    <div className="bottom-color-bars">
                        <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#6efff1' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                        <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
                    </div>
                </section>

            </main>

        </>
    );
}

export default HomePage;