import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios'; 
// Importamos os ícones de coração e loading para melhorar a experiência do usuário
import { FaHeart, FaSpinner } from 'react-icons/fa'; 

function DoarPage() {

    // --- Estados para Doação ---
    const [selectedAmount, setSelectedAmount] = useState('');
    const [customAmount, setCustomAmount] = useState('');
    
    // --- Estados para API e UX ---
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    
    // ATENÇÃO: URL do seu Backend (porta 4000)
    // Use 'http://localhost:4000' para testes locais
    const API_URL = 'http://localhost:4000/api/pagamentos/preferencia'; 

    const handleAmountClick = (amount) => {
        setSelectedAmount(amount);
        setCustomAmount(''); 
    };

    const handleCustomAmountChange = (e) => {
        setSelectedAmount(''); 
        setCustomAmount(e.target.value);
    };

    // Calcula o valor final (preferencialmente o valor pré-selecionado, senão o personalizado)
    const finalAmount = selectedAmount || parseFloat(customAmount);

    // Função assíncrona para chamar a API e redirecionar
    const handleDoacaoSubmit = async (e) => {
        e.preventDefault(); // IMPEDE O COMPORTAMENTO PADRÃO DO FORMULÁRIO (EVITA O ERRO 404)
        setLoading(true);
        setErro(null);

        // Validação básica do valor final
        if (!finalAmount || finalAmount <= 0) {
            setErro("Por favor, escolha ou digite um valor para doar.");
            setLoading(false);
            return;
        }

        try {
            // Chamada POST para o seu Backend (Node.js/Express)
            const response = await axios.post(API_URL, { 
                valor: finalAmount,
                // doadorId: Incluir aqui o ID do usuário, se ele estiver autenticado
            });

            const { init_point } = response.data;

            // Redirecionar para o Mercado Pago
            if (init_point) {
                window.location.href = init_point; 
            } else {
                setErro("O link de pagamento não foi retornado pela API.");
            }
        } catch (error) {
            console.error("Erro ao processar doação:", error.response ? error.response.data : error.message);
            // Mostra o erro de validação do Backend para o usuário
            setErro("Erro ao iniciar o pagamento. Consulte o console do Backend."); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <main 
            className="donation-page-wrapper" 
            style={{ backgroundImage: "linear-gradient(rgba(17, 31, 68, 0.7), rgba(17, 31, 68, 0.7)), url('/documentos/paginadoar.JPG')" }}
        >

            <div className="donation-header">
                <h1>SEJA UM DOADOR</h1>
                <div className="thin-bar" style={{ backgroundColor: '#6efff1' }}></div>
            </div>

            <div className="donation-box">
                <h2>Faça sua Doação</h2>
                <p>Sua contribuição é a esperança de muitas famílias. Escolha um valor e faça parte da mudança!</p>

                {/* O FORMULÁRIO AGORA CHAMA A FUNÇÃO DE API */}
                <form className="donation-form" onSubmit={handleDoacaoSubmit}> 
                    
                    <div className="form-group">
                        <label className="form-label">Escolha um valor:</label>
                        <div className="amount-options">
                            <button 
                                type="button" 
                                className={`btn ${selectedAmount === 20 ? 'active' : ''}`} 
                                onClick={() => handleAmountClick(20)}
                            >
                                R$ 20
                            </button>
                            <button 
                                type="button" 
                                className={`btn ${selectedAmount === 50 ? 'active' : ''}`} 
                                onClick={() => handleAmountClick(50)}
                            >
                                R$ 50
                            </button>
                            <button 
                                type="button" 
                                className={`btn ${selectedAmount === 100 ? 'active' : ''}`} 
                                onClick={() => handleAmountClick(100)}
                            >
                                R$ 100
                            </button>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="custom-amount" className="form-label">Ou digite outro valor (R$):</label>
                        <input 
                            type="number" 
                            id="custom-amount" 
                            className="form-input custom-amount" 
                            placeholder="Ex: 30" 
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            step="0.01" 
                            min="1.00"
                        />
                    </div>
                    
                    {/* Exibir Erro */}
                    {erro && (
                        <p className="error-message" style={{ color: '#f06678', textAlign: 'center', fontWeight: 'bold' }}>
                            {erro}
                        </p>
                    )}

                    {/* Botão de Submissão */}
                    <button 
                        type="submit" 
                        className="btn btn-red btn-doar"
                        disabled={loading || !finalAmount || finalAmount <= 0} 
                    >
                        {loading ? (
                            <FaSpinner className="animate-spin inline-block mr-2" />
                        ) : (
                            <FaHeart className="inline-block mr-2" />
                        )}
                        {loading ? 'Processando...' : 'Doar Agora (Pix ou Cartão)'}
                    </button>

                    <p style={{ fontSize: '14px', textAlign: 'center', marginTop: '20px', marginBottom: '0' }}>
                        Ambiente 100% seguro.
                    </p>
                </form>
            </div>

            <div className="bottom-color-bars">
                <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#75ecfcff' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#75ecfcff' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
            </div>
        </main>
    );
}

export default DoarPage;