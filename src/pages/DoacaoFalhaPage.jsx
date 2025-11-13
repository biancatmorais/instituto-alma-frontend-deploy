import React from 'react';

const DoacaoFalhaPage = () => {
  // O Mercado Pago (ou outro gateway) redireciona para cá após o pagamento RECUSADO.
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">💔 Não foi Possível Processar a Doação</h1>
      <p className="text-lg text-gray-700">
        Ocorreu um erro ao processar seu pagamento ou ele foi recusado. Por favor, tente novamente ou utilize outro método de pagamento.
      </p>
      <a href="/doar" className="mt-6 inline-block bg-red-700 text-white py-3 px-6 rounded-lg hover:bg-red-800 transition">
        Tentar Novamente
      </a>
    </div>
  );
};

export default DoacaoFalhaPage;