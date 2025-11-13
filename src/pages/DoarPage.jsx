import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 

// Define a URL base da API (lendo do ambiente, ou usando fallback)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function DoarPage() {

    const [selectedAmount, setSelectedAmount] = useState('');
    const [customAmount, setCustomAmount] = useState('');
    const [formStatus, setFormStatus] = useState(''); // Mensagem de feedback
    const [loading, setLoading] = useState(false); // Estado de carregamento

    const handleAmountClick = (amount) => {
        setSelectedAmount(amount);
        setCustomAmount(''); 
    };

    const handleCustomAmountChange = (e) => {
        setSelectedAmount(''); 
        // Permite apenas números e pontos/vírgulas (ajustar conforme a cultura)
        const value = e.target.value.replace(/,/g, '.');
        setCustomAmount(value);
    };

    const handleDonation = async (e) => {
        e.preventDefault();
        setFormStatus('');
        setLoading(true);

        // O valor final deve ser um número e positivo
        const finalAmount = parseFloat(selectedAmount || customAmount);
        
        if (isNaN(finalAmount) || finalAmount <= 0) {
            setFormStatus('Erro: Por favor, selecione ou digite um valor válido.');
            setLoading(false);
            return;
        }

        try {
            // 1. Chama o endpoint do backend para criar a preferência de pagamento no Mercado Pago
            const response = await fetch(`${API_URL}/api/pagamentos/preferencia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: finalAmount }) 
            });

            const data = await response.json();

            if (!response.ok) {
                // Se a API retornar um erro (ex: falha no token do MP)
                throw new Error(data.message || 'Erro ao iniciar o pagamento.');
            }

            // 2. SUCESSO: Redireciona o utilizador para o link do Mercado Pago
            const paymentUrl = data.init_point;
            
            setFormStatus('Redirecionando para o Mercado Pago...');
            window.location.href = paymentUrl;

            // Nota: O código após window.location.href não será executado, mas mantemos o finally
            
        } catch (error) {
            console.error('Erro de pagamento:', error);
            setFormStatus(`Erro: ${error.message || 'Falha ao conectar com o gateway de pagamento.'}`);
        } finally {
            setLoading(false);
        }
    };

    const finalAmount = selectedAmount || customAmount;

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

                {/* CORRIGIDO: Usa onSubmit com a função de fetch */}
                <form className="donation-form" onSubmit={handleDonation}>
                    
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
                        />
                        <input type="hidden" name="final_amount" value={finalAmount} />
                    </div>

                    {formStatus && (
                        <p style={{ color: formStatus.startsWith('Erro:') ? 'red' : 'green', textAlign: 'center', marginBottom: '15px', fontWeight: '600' }}>
                            {formStatus}
                        </p>
                    )}

                    <button type="submit" className="btn btn-red btn-doar" disabled={loading || !finalAmount}>
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
                <div className="bottom-bar" style={{ backgroundColor: '#111F44' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#111F44' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
            </div>
        </main>
    );
}

export default DoarPage;