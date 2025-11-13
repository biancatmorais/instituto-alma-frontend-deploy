import React from 'react';

const DoacaoSucessoPage = () => {
  // O Mercado Pago (ou outro gateway) redireciona para cá após o pagamento APROVADO.
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">✨ Doação Realizada com Sucesso! ✨</h1>
      <p className="text-lg text-gray-700">
        Sua generosidade fará uma grande diferença na vida das pessoas assistidas pelo Instituto Alma. 
        Um e-mail de confirmação será enviado.
      </p>
      {/* Aqui você pode usar os estilos do seu Design System */}
      <a href="/" className="mt-6 inline-block bg-purple-700 text-white py-3 px-6 rounded-lg hover:bg-purple-800 transition">
        Voltar para a Home
      </a>
    </div>
  );
};

export default DoacaoSucessoPage;