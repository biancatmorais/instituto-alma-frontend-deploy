import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PortalPage() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', senha: '', error: '', success: '' });
  const [registerData, setRegisterData] = useState({ nome: '', email: '', senha: '', error: '', success: '' });
  const [resetData, setResetData] = useState({ email: '', error: '', success: '' });

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value, error: '', success: '' }));
  };

  // --- LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.senha) {
      setLoginData(prev => ({ ...prev, error: 'Preencha todos os campos.' }));
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginData.email, senha: loginData.senha })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao fazer login.');
      localStorage.setItem('token', data.token);
      setLoginData({ email: '', senha: '', error: '', success: 'Login realizado com sucesso!' });
      navigate('/dashboard');
    } catch (err) {
      setLoginData(prev => ({ ...prev, error: err.message }));
    } finally {
      setLoading(false);
    }
  };

  // --- REGISTRO ---
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerData.nome || !registerData.email || !registerData.senha) {
      setRegisterData(prev => ({ ...prev, error: 'Preencha todos os campos.' }));
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: registerData.nome, email: registerData.email, senha: registerData.senha })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao registrar.');
      setRegisterData({ nome: '', email: '', senha: '', error: '', success: 'Cadastro realizado com sucesso!' });
      setActiveTab('login');
    } catch (err) {
      setRegisterData(prev => ({ ...prev, error: err.message }));
    } finally {
      setLoading(false);
    }
  };

  // --- RESET SENHA ---
  const handleReset = async (e) => {
    e.preventDefault();
    if (!resetData.email) {
      setResetData(prev => ({ ...prev, error: 'Informe seu e-mail.' }));
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetData.email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao enviar link de recuperação.');
      setResetData({ email: '', error: '', success: 'Link enviado para seu e-mail!' });
    } catch (err) {
      setResetData(prev => ({ ...prev, error: err.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-page">
      <div className="portal-tabs">
        <button onClick={() => setActiveTab('login')} className={activeTab === 'login' ? 'active-tab' : ''}>Login</button>
        <button onClick={() => setActiveTab('registro')} className={activeTab === 'registro' ? 'active-tab' : ''}>Registrar</button>
        <button onClick={() => setActiveTab('reset')} className={activeTab === 'reset' ? 'active-tab' : ''}>Recuperar Senha</button>
      </div>

      <div className="portal-content">
        {activeTab === 'login' && (
          <form className="portal-form" onSubmit={handleLogin}>
            {loginData.error && <p className="error-message">{loginData.error}</p>}
            {loginData.success && <p className="success-message">{loginData.success}</p>}
            <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleChange(setLoginData)} />
            <input type="password" name="senha" placeholder="Senha" value={loginData.senha} onChange={handleChange(setLoginData)} />
            <button type="submit" disabled={loading}>{loading ? 'Carregando...' : 'Entrar'}</button>
          </form>
        )}

        {activeTab === 'registro' && (
          <form className="portal-form" onSubmit={handleRegister}>
            {registerData.error && <p className="error-message">{registerData.error}</p>}
            {registerData.success && <p className="success-message">{registerData.success}</p>}
            <input type="text" name="nome" placeholder="Nome" value={registerData.nome} onChange={handleChange(setRegisterData)} />
            <input type="email" name="email" placeholder="Email" value={registerData.email} onChange={handleChange(setRegisterData)} />
            <input type="password" name="senha" placeholder="Senha" value={registerData.senha} onChange={handleChange(setRegisterData)} />
            <button type="submit" disabled={loading}>{loading ? 'Carregando...' : 'Registrar'}</button>
          </form>
        )}

        {activeTab === 'reset' && (
          <form className="portal-form" onSubmit={handleReset}>
            {resetData.error && <p className="error-message">{resetData.error}</p>}
            {resetData.success && <p className="success-message">{resetData.success}</p>}
            <input type="email" name="email" placeholder="Email" value={resetData.email} onChange={handleChange(setResetData)} />
            <button type="submit" disabled={loading}>{loading ? 'Carregando...' : 'Enviar link'}</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default PortalPage;
