import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import { FaHeart, FaSpinner } from 'react-icons/fa'; 

function DoarPage() {
    // --- Estados para Doação ---
    const [selectedAmount, setSelectedAmount] = useState('');
    const [customAmount, setCustomAmount] = useState('');

    // --- Estados para API e UX ---
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);

    // ✅ Usa a URL do backend a partir do .env (Vercel/produção)
    // Se não existir, usa localhost para testes locais
    const API_URL = `${import.meta.env.VITE_API_URL || 'https://instituto-alma-backend-azure-production.up.railway.app'}/api/pagamentos/preferencia`;

    const handleAmountClick = (amount) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e) => {
        setSelectedAmount('');
        setCustomAmount(e.target.value);
    };

    const finalAmount = selectedAmount || parseFloat(customAmount);

    const handleDoacaoSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro(null);

        if (!finalAmount || finalAmount <= 0) {
            setErro("Por favor, escolha ou digite um valor para doar.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(API_URL, {
                valor: finalAmount,
            });

            const { init_point } = response.data;

            if (init_point) {
                window.location.href = init_point;
            } else {
                setErro("O link de pagamento não foi retornado pela API.");
            }
        } catch (error) {
            console.error("Erro ao processar doação:", error.response ? error.response.data : error.message);
            setErro("Erro ao iniciar o pagamento. Consulte o console do servidor.");
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

                <form className="donation-form" onSubmit={handleDoacaoSubmit}>
                    <div className="form-group">
                        <label className="form-label">Escolha um valor:</label>
                        <div className="amount-options">
                            {[20, 50, 100].map((amount) => (
                                <button
                                    key={amount}
                                    type="button"
                                    className={`btn ${selectedAmount === amount ? 'active' : ''}`}
                                    onClick={() => handleAmountClick(amount)}
                                >
                                    R$ {amount}
                                </button>
                            ))}
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

                    {erro && (
                        <p className="error-message" style={{ color: '#f06678', textAlign: 'center', fontWeight: 'bold' }}>
                            {erro}
                        </p>
                    )}

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
                {['#f06678', '#ffc9fc', '#75ecfcff', '#ffc9fc', '#f06678', '#75ecfcff', '#ffc9fc', '#f06678'].map((color, i) => (
                    <div key={i} className="bottom-bar" style={{ backgroundColor: color }}></div>
                ))}
            </div>
        </main>
    );
}

export default DoarPage;
