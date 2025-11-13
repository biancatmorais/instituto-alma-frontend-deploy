import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Garanta que o nome do ficheiro está correto (AuthContext.jsx ou AuthContext)

// Define a URL base da API (lendo do ambiente VITE_API_URL, ou usando fallback)
const API_URL = import.meta.env.VITE_API_URL || 'https://instituto-alma-backend-azure-production.up.railway.app';

function PortalPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    // --- ESTADOS PARA OS FORMULÁRIOS ---

    const [loginEmail, setLoginEmail] = useState('');
    const [loginSenha, setLoginSenha] = useState('');
    const [loginError, setLoginError] = useState('');

    const [regNome, setRegNome] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regSenha, setRegSenha] = useState('');
    const [registerMessage, setRegisterMessage] = useState('');

    // --- FUNÇÃO DE LOGIN ---
    const handleLogin = async (event) => {
        event.preventDefault();
        setLoginError('');

        try {
            // CORRIGIDO: Usa a variável de ambiente API_URL
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, senha: loginSenha })
            });

            const data = await response.json();

            if (response.ok) {
                // SUCESSO!
                login(data.token, data.user); 
                navigate('/dashboard');
            } else {
                // ERRO
                setLoginError(data.message || 'Email ou senha inválidos.');
            }
        } catch (error) {
            console.error('Erro de rede no login:', error);
            setLoginError('Erro: Não foi possível conectar ao servidor.');
        }
    };


    // --- FUNÇÃO DE REGISTRO ---
    const handleRegister = async (event) => {
        event.preventDefault();
        setRegisterMessage('');

        try {
            // CORRIGIDO: Usa a variável de ambiente API_URL
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: regNome, email: regEmail, senha: regSenha })
            });

            const data = await response.json();

            if (response.status === 201) {
                // SUCESSO!
                setRegisterMessage('Conta criada com sucesso! Faça login para aceder ao portal.');
                setRegNome('');
                setRegEmail('');
                setRegSenha('');
                setLoginEmail(regEmail); // Preenche o campo de login
                setLoginSenha('');
            } else {
                // ERRO
                setRegisterMessage(data.message || 'Erro ao criar conta.');
            }
        } catch (error) {
            console.error('Erro de rede no registro:', error);
            setRegisterMessage('Erro: Não foi possível conectar ao servidor.');
        }
    };


    return (
        <main 
            className="portal-page-wrapper" 
            style={{ 
                backgroundImage: "linear-gradient(rgba(17, 31, 68, 0.7), rgba(17, 31, 68, 0.7)), url('/documentos/paginadoar.JPG')"
            }}
        >
            
            <div className="portal-header">
                <h1>PORTAL DO DOADOR</h1>
                <div className="thin-bar" style={{ backgroundColor: '#6efff1' }}></div>
            </div>

            <div className="portal-container">
                
                <div className="login-col">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
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
                        
                        {loginError && (
                            <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px', fontWeight: '600' }}>
                                {loginError}
                            </p>
                        )}

                        <button type="submit" className="btn btn-primary">Entrar</button>
                    </form>
                </div>
                
                <div className="signup-col">
                    <h2>Inscrição</h2>
                    <form onSubmit={handleRegister}>
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
                            <p style={{ 
                                color: registerMessage.startsWith('Erro:') ? 'red' : 'green', 
                                textAlign: 'center', 
                                marginBottom: '15px', 
                                fontWeight: '600' 
                            }}>
                                {registerMessage}
                            </p>
                        )}

                        <button type="submit" className="btn btn-red">Criar Conta</button>
                    </form>
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