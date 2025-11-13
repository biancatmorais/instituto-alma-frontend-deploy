import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/TempAuthContext'; 

function DashboardPage() {
  const { user } = useAuth(); 

  return (
    <main className="dashboard-page-wrapper">

      <div className="dashboard-header" style={{ alignItems: 'center' }}>
        
        <h1>{user ? `Olá, ${user.nome}!` : 'Minha Conta'}</h1>

        {user && (user.role === 'voluntario' || user.role === 'admin') && (
          <Link to="/voluntario" className="btn btn-primary">Sou Voluntário</Link>
        )}
      </div>

      <div className="dashboard-container">
        
        <div className="dashboard-col-left">
          <div className="dashboard-card ola-doador">
            <h2>Seja bem-vindo, {user ? user.role : 'Doador'}!</h2>
            <p>Aqui você pode acompanhar seu histórico de doações e gerenciar seus dados. Obrigado por fazer parte da mudança!</p>
            <Link to="/doar" className="btn btn-red" style={{ width: '100%' }}>Fazer Nova Doação</Link>
          </div>

          <div className="dashboard-card">
            <h2>Histórico de Contribuições</h2>
            <table className="history-table">
              <tbody>
                <tr>
                  <td>25/10/2025</td>
                  <td>R$ 50,00</td>
                  <td>Pix</td>
                  <td><span className="status-aprovado">Aprovado</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="dashboard-card">
            <h2>Ações Concluídas</h2>
            <table className="history-table">
              <tbody>
                <tr>
                  <td>Sopa Fraterna (Outubro)</td>
                  <td>Comunidade Z</td>
                  <td>R$ 1.500,00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-col-right">
          <div className="dashboard-card">
            <h2>Meus Dados</h2>
            <form action="/atualizar-dados" method="POST">
              <div className="form-group">
                <label htmlFor="dash-nome" className="form-label">Nome Completo</label>
                <input type="text" id="dash-nome" name="nome" className="form-input" defaultValue={user ? user.nome : 'Carregando...'} />
              </div>
              <div className="form-group">
                <label htmlFor="dash-email" className="form-label">Email</label>
                <input type="email" id="dash-email" name="email" className="form-input" defaultValue={user ? user.email : 'Carregando...'} />
              </div>
              
              <div className="form-group">
                <label htmlFor="dash-cpf" className="form-label">CPF</label>
                <input type="text" id="dash-cpf" name="cpf" className="form-input" placeholder="123.456.789-00" />
              </div>
              <div className="form-group">
                <label htmlFor="dash-tel" className="form-label">Telefone</label>
                <input type="tel" id="dash-tel" name="telefone" className="form-input" placeholder="(11) 98765-4321" />
              </div>
              <div className="form-group">
                <label htmlFor="dash-senha" className="form-label">Nova Senha</label>
                <input type="password" id="dash-senha" name="senha" className="form-input" placeholder="Deixe em branco se não quiser mudar" />
              </div>
              
              <button type="submit" className="btn btn-red" style={{ width: '100%' }}>Salvar Alterações</button>
            </form>
          </div>
          
          <div className="dashboard-card">
            <h2>Próximos Eventos</h2>
            <div className="evento-info-box">
              <strong>23/12 - Ação de Natal</strong><br />
              Local: Av. da Liberdade, 532 - Liberdade, São Paulo - SP, 01502-001
            </div>
            <a href="#" className="btn btn-red" style={{ width: '100%', marginTop: '20px' }}>Participar</a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;