import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

// Define a URL base da API (Esta é a sintaxe final que deve funcionar no Vercel)
const API_URL = process.env.RAILWAY_API_URL || 'https://instituto-alma-backend-azure-production.up.railway.app';

function PortalPage() {
    const navigate = useNavigate();
    const { login } = useAuth(); 

    // --- ESTADOS ---
    // Mantemos activeTab para permitir a aba de Reset (Recuperar Senha)
    const [activeTab, setActiveTab] = useState('columns'); // NOVO estado: 'columns' ou 'reset'
    const [loading, setLoading] = useState(false);

    // Estados para o formulário de Login
    const [loginEmail, setLoginEmail] = useState('');
    const [loginSenha, setLoginSenha] = useState('');
    const [loginError, setLoginError] = useState(''); 

    // Estados para o formulário de Inscrição (Registro)
    const [regNome, setRegNome] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regSenha, setRegSenha] = useState('');
    const [registerMessage, setRegisterMessage] = useState(''); 

    // Estados para o formulário de Recuperação de Senha
    const [resetData, setResetData] = useState({ email: '', error: '', success: '' });

    // --- FUNÇÃO DE LOGIN ---
    const handleLogin = async (event) => {
        event.preventDefault();
        setLoginError(''); 
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, senha: loginSenha })
            });

            const data = await response.json();

            if (response.ok) {
                login(data.token, data.user); 
                navigate('/dashboard');
            } else {
                setLoginError(data.message || 'Email ou senha inválidos.');
            }
        } catch (error) {
            console.error('Erro de rede no login:', error);
            setLoginError('Erro: Não foi possível conectar ao servidor. Verifique a API.');
        } finally {
            setLoading(false);
        }
    };


    // --- FUNÇÃO DE REGISTRO ---
    const handleRegister = async (event) => {
        event.preventDefault();
        setRegisterMessage('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: regNome, email: regEmail, senha: regSenha })
            });

            const data = await response.json();

            if (response.status === 201) {
                setRegisterMessage('Conta criada com sucesso! Faça login para aceder ao portal.');
                setRegNome('');
                setRegEmail('');
                setRegSenha('');
                setActiveTab('columns'); // Mantém na visualização de colunas
            } else {
                setRegisterMessage(data.message || 'Erro ao criar conta.');
            }
        } catch (error) {
            console.error('Erro de rede no registro:', error);
            setRegisterMessage('Erro: Não foi possível conectar ao servidor. Verifique a API.');
        } finally {
            setLoading(false);
        }
    };

    // --- RESET SENHA ---
    const handleReset = async (e) => {
        e.preventDefault();
        setResetData(prev => ({ ...prev, error: '', success: '' }));
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
    
    // Função utilitária para manusear a mudança de estados de forms não diretamente ligados ao login/registo
    const handleChange = (setter) => (e) => {
        const { name, value } = e.target;
        setter(prev => ({ ...prev, [name]: value, error: '', success: '' }));
    };


    return (
        <main 
            className="portal-page-wrapper" 
            style={{ 
                // A imagem de fundo deve ser carregada via CSS ou pelo path absoluto se estiver no 'public'
                backgroundImage: "linear-gradient(rgba(17, 31, 68, 0.8), rgba(17, 31, 68, 0.8)), url('/documentos/paginadoar.JPG')"
            }}
        >
            
            <div className="portal-header">
                <h1>PORTAL DO DOADOR</h1>
                <div className="thin-bar" style={{ backgroundColor: '#6efff1' }}></div>
            </div>

            <div className="portal-container-tabs">
                
                {/* BOTÕES DE NAVEGAÇÃO DE TOPO - Apenas para Recuperação de Senha */}
                <div className="portal-tabs">
                    <button onClick={() => setActiveTab('columns')} className={activeTab === 'columns' ? 'active-tab' : ''}>Login/Cadastro</button>
                    <button onClick={() => setActiveTab('reset')} className={activeTab === 'reset' ? 'active-tab' : ''}>Recuperar Senha</button>
                </div>

                <div className="portal-content">
                    
                    {/* --- VISUALIZAÇÃO DE DUAS COLUNAS (LOGIN E INSCRIÇÃO) --- */}
                    {activeTab === 'columns' && (
                        <div className="portal-two-columns">
                            
                            {/* --- COLUNA DE LOGIN --- */}
                            <div className="portal-card login-col">
                                <h2>Login</h2>
                                <form onSubmit={handleLogin} className="portal-form">
                                    <div className="form-group">
                                        <label htmlFor="login-email" className="form-label">Email</label>
                                        <input 
                                            type="email" 
                                            id="login-email" 
                                            className="form-input" 
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="login-senha" className="form-label">Senha</label>
                                        <input 
                                            type="password" 
                                            id="login-senha" 
                                            className="form-input" 
                                            value={loginSenha}
                                            onChange={(e) => setLoginSenha(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    
                                    {loginError && (<p className="error-message">{loginError}</p>)}

                                    <button type="submit" className="btn btn-primary btn-login" disabled={loading}>
                                        {loading ? 'Entrando...' : 'Entrar'}
                                    </button>
                                </form>
                            </div>

                            {/* --- COLUNA DE INSCRIÇÃO --- */}
                            <div className="portal-card signup-col">
                                <h2>Inscrição</h2>
                                <form onSubmit={handleRegister} className="portal-form">
                                    <div className="form-group">
                                        <label htmlFor="signup-nome" className="form-label">Nome Completo</label>
                                        <input 
                                            type="text" 
                                            id="signup-nome" 
                                            className="form-input"
                                            value={regNome}
                                            onChange={(e) => setRegNome(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="signup-email" className="form-label">Email</label>
                                        <input 
                                            type="email" 
                                            id="signup-email" 
                                            className="form-input" 
                                            value={regEmail}
                                            onChange={(e) => setRegEmail(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="signup-senha" className="form-label">Criar Senha</label>
                                        <input 
                                            type="password" 
                                            id="signup-senha" 
                                            className="form-input" 
                                            value={regSenha}
                                            onChange={(e) => setRegSenha(e.target.value)}
                                            required 
                                        />
                                    </div>

                                    {registerMessage && (
                                        <p className={registerMessage.startsWith('Erro:') ? 'error-message' : 'success-message'}>
                                            {registerMessage}
                                        </p>
                                    )}

                                    <button type="submit" className="btn btn-red btn-signup" disabled={loading}>
                                        {loading ? 'Registrando...' : 'Criar Conta'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* --- VISUALIZAÇÃO DE RESET DE SENHA --- */}
                    {activeTab === 'reset' && (
                        <div className="tab-pane reset-col">
                            <h2>Recuperar Senha</h2>
                            <form onSubmit={handleReset} className="portal-form">
                                {resetData.error && <p className="error-message">{resetData.error}</p>}
                                {resetData.success && <p className="success-message">{resetData.success}</p>}
                                <div className="form-group">
                                    <label htmlFor="reset-email" className="form-label">Email de Recuperação</label>
                                    <input 
                                        type="email" 
                                        id="reset-email" 
                                        name="email"
                                        className="form-input" 
                                        value={resetData.email} 
                                        onChange={(e) => setResetData(prev => ({ ...prev, email: e.target.value, error: '', success: '' }))}
                                        required 
                                    />
                                </div>
                                
                                <button type="submit" className="btn btn-red" disabled={loading}>
                                    {loading ? 'Enviando...' : 'Enviar Link'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <div className="bottom-color-bars">
                <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#78e6faff' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#78e6faff' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
                <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
            </div>
        </main>
    );
}

export default PortalPage;