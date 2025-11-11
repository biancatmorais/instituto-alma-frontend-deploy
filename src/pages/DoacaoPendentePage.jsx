import React from 'react';

const DoacaoPendentePage = () => {
  // O Mercado Pago (ou outro gateway) redireciona para cá após o pagamento PENDENTE (Ex: Boleto, PIX).
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold text-yellow-600 mb-4">⏳ Pagamento Pendente de Confirmação</h1>
      <p className="text-lg text-gray-700">
        Obrigado por iniciar sua doação! Assim que o pagamento for processado (geralmente via PIX ou Boleto), 
        o status será atualizado. Você receberá uma confirmação.
      </p>
      <a href="/" className="mt-6 inline-block bg-yellow-700 text-white py-3 px-6 rounded-lg hover:bg-yellow-800 transition">
        Acompanhar
      </a>
    </div>
  );
};

export default DoacaoPendentePage;