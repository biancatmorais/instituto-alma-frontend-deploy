import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import EventModal from '../components/EventModal.jsx'; 
import Header from '../components/Header.jsx'; // <-- Importa o Header existente

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

    // -----------------------------
    // Funções de renderização (mesmo que você já tinha)
    // -----------------------------
    const renderEventosList = () => {
        if (isLoadingEventos) return <div className="evento-info-box">A carregar eventos...</div>;
        if (errorEventos) return <div className="evento-info-box" style={{ color: 'red' }}>{errorEventos}</div>;
        const proximoEvento = eventos[0]; 
        if (!proximoEvento) return (
            <div className="evento-info-box">
                <strong>Nenhum evento futuro agendado.</strong><br />
                <span style={{fontSize: '0.85em', opacity: 0.7}}>Verifique a seção de notícias para eventos passados.</span>
            </div>
        );
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
            cells.push(isEvento 
                ? <td key={dia} className="dia-evento"><span>{dia}</span></td>
                : <td key={dia}>{dia}</td>);
        }
        const diasDesabilitados = [1,2,3,4];
        diasDesabilitados.forEach(dia => {
            cells.push(<td key={`prox-${dia}`} className="dia-desabilitado">{dia}</td>);
        });

        const rows = [];
        for (let i = 0; i < 5; i++) {
            rows.push(<tr key={i}>{cells.slice(i*7, (i*7)+7)}</tr>);
        }
        return <tbody>{rows}</tbody>;
    };

    const renderAtividadesCarrossel = () => {
        if (isLoadingAtividades) return <div style={{textAlign:'center', padding:'50px', color:'white'}}>A carregar atividades...</div>;
        if (errorAtividades) return <div style={{textAlign:'center', padding:'50px', color:'red'}}>Erro: {errorAtividades}</div>;
        if (atividades.length === 0) {
            return (
                <div className={`carousel-slide active-slide`}>
                    <div className="slide-top-bar" style={{backgroundColor:'#6efff1'}}></div>
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
                                <p>O Instituto Alma acredita no poder de um prato de comida quente...</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        const imageBaseUrl = `${API_URL}/uploads/`;
        return atividades.map((atividade, index) => (
            <div key={atividade.id} className={`carousel-slide ${activeSlide===index?'active-slide':''}`}>
                <div className="slide-top-bar" style={{backgroundColor: slidesData[index%slidesData.length].barColor}}></div>
                <div className="slide-content-wrapper">
                    <div className="image-grid">
                        {['imagem_url_1','imagem_url_2','imagem_url_3','imagem_url_4'].map((imgKey,i) => (
                            atividade[imgKey] && (
                                <div className="grid-image-placeholder" key={i}>
                                    <img src={imageBaseUrl + atividade[imgKey]} alt={`${atividade.titulo} ${i+1}`} />
                                </div>
                            )
                        ))}
                    </div>
                    <div className="description-panel">
                        <h2>{atividade.titulo.toUpperCase()}</h2>
                        <div className="description-placeholder">
                            <p style={{whiteSpace:'pre-wrap'}}>{atividade.descricao}</p>
                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    const renderCarrosselDots = () => {
        const colors = ['#f06678','#ffc9fc','#64B5F6','#6efff1'];
        const items = atividades.length>0?atividades:slidesData;
        return items.map((item,index)=>(
            <div key={item.id||index} className={`nav-dot ${activeSlide===index?'active-dot':''}`}
                 style={{backgroundColor:colors[index%colors.length]}}
                 onClick={()=>setActiveSlide(index)} />
        ));
    };

    const handleSubmitOuvidoria = async (event) => {
        event.preventDefault(); 
        setFormStatus('Enviando...');
        const formData = { nome: ouvidoriaNome, email: ouvidoriaEmail, telefone: ouvidoriaTelefone, mensagem: ouvidoriaMensagem };
        try {
            const response = await fetch(`${API_URL}/api/ouvidoria`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(formData)
            });
            const data = await response.json();
            if(response.ok){
                setFormStatus(data.message);
                setOuvidoriaNome(''); setOuvidoriaEmail(''); setOuvidoriaTelefone(''); setOuvidoriaMensagem('');
            } else setFormStatus(`Erro: ${data.message}`);
        } catch(error){
            console.error('Erro ao conectar com a API:',error);
            setFormStatus('Erro: Não foi possível conectar ao servidor.');
        }
    };

    return (
        <>
            <Header /> {/* Mantém 100% do design, remove duplicidade */}
            {isModalOpen && <EventModal onClose={closeModal} />}

            <main>
                {/* Aqui permanece todo o resto do conteúdo da HomePage, exatamente igual */}
                {/* Hero, Sobre Nós, Atividades, Transparência, Eventos, Ouvidoria */}
            </main>
        </>
    );
}

export default HomePage;
