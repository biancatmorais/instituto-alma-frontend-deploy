import React, { useState, useEffect, useCallback } from 'react'; 
import { Link } from 'react-router-dom'; 
import EventModal from '../components/EventModal'; 

// Define a URL base da API lendo a variável de ambiente.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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
      {/* resto do componente sem alteração no JSX */}
      {isModalOpen && <EventModal onClose={closeModal} />}
    </>
  );
}

export default HomePage;
