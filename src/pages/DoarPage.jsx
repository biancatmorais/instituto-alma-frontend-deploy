import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 

function DoarPage() {

  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount(''); 
  };

  const handleCustomAmountChange = (e) => {
    setSelectedAmount(''); 
    setCustomAmount(e.target.value);
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

          <form className="donation-form" action="/processar-doacao" method="POST">
              
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
                  />
                  <input type="hidden" name="final_amount" value={finalAmount} />
              </div>

              <button type="submit" className="btn btn-red btn-doar">Doar Agora (Pix ou Cartão)</button>

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
