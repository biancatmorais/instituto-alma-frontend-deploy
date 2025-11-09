import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Criar o Contexto
const AuthContext = createContext(null);

// 2. Criar o Provedor (Componente que vai envolver o App)
export function AuthProvider({ children }) {
  // 'user' vai guardar {nome, email, role}
  const [user, setUser] = useState(null); 
  // 'token' vai guardar o string do JWT
  const [token, setToken] = useState(null);

  // 3. Efeito para verificar o localStorage quando o app carrega
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []); // O array vazio [] faz isso rodar só uma vez

  // 4. Função de Login
  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 5. Função de Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // 6. Valor que será compartilhado com todos os componentes
  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 7. Hook customizado (ESTA É A PARTE QUE O ERRO DIZ QUE ESTÁ FALTANDO)
export function useAuth() {
  return useContext(AuthContext);
}