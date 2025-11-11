import React from 'react';
import { Link } from 'react-router-dom'; 

function VoluntarioPage() {
  return (
    <main className="page-wrapper">

      <div className="page-header">
        <h1>Portal do Voluntário</h1>
        <Link to="/dashboard" className="btn btn-secondary">Voltar para Minha Conta</Link>
      </div>

      <div className="page-container">

        <div className="col-left">
          
          <div className="card">
            <h2>Olá, Voluntário!</h2>
            <p>Obrigado por dedicar seu tempo para transformar vidas. Veja abaixo as próximas ações e inscreva-se para participar.</p>
          </div>

          <div className="card">
            <h2>Próximas Ações (Inscreva-se)</h2>
            <div className="action-list">
              
              <div className="action-item">
                <div className="action-info">
                  <h3>Ação de Natal</h3>
                  <p>Data: 23/12/2025 | Local: Av. da Liberdade, 532</p>
                </div>
                <a href="#" className="btn btn-red">Quero Participar</a>
              </div>
              
              <div className="action-item">
                <div className="action-info">
                  <h3>Sopa Fraterna (Sábado)</h3>
                  <p>Data: 13/12/2025 | Local: Sede do Instituto</p>
                </div>
                <a href="#" className="btn btn-red">Quero Participar</a>
              </div>

            </div>
          </div>

          <div className="card">
            <h2>Minhas Escalas</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ação</th>
                  <th>Local</th>
                  <th>Horário</th>
                  <th>Minha Função</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sopa Fraterna</td>
                  <td>Sede do Instituto</td>
                  <td>18:00 - 20:00</td>
                  <td>Preparo</td>
                </tr>
                <tr>
                  <td>Ação de Natal</td>
                  <td>Av. da Liberdade, 532</td>
                  <td>10:00 - 14:00</td>
                  <td>Distribuição</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-right">
          <div className="card">
            <h2>Minhas Estatísticas</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <strong>12</strong>
                <span>Ações Concluídas</span>
              </div>
              <div className="stat-item">
                <strong>48</strong>
                <span>Horas Doadas</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Meus Dados (Voluntário)</h2>
            <form action="/atualizar-voluntario" method="POST">
              <div className="form-group">
                <label htmlFor="dash-nome" className="form-label">Nome Completo</label>
                <input type="text" id="dash-nome" name="nome" className="form-input" defaultValue="Nome do Doador" />
              </div>
              <div className="form-group">
                <label htmlFor="dash-email" className="form-label">Email</label>
                <input type="email" id="dash-email" name="email" className="form-input" defaultValue="doador@email.com" />
              </div>
              <div className="form-group">
                <label htmlFor="dash-tel" className="form-label">Telefone</label>
                <input type="tel" id="dash-tel" name="telefone" className="form-input" defaultValue="(11) 98765-4321" />
              </div>
              <button type="submit" className="btn btn-red" style={{ width: '100%' }}>Salvar Alterações</button>
            </form>
          </div>
        </div>
        
      </div>
    </main>
  );
}

export default VoluntarioPage;