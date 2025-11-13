import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' 
import { BrowserRouter } from 'react-router-dom'
<<<<<<< HEAD
import { AuthProvider } from './context/AuthContext.jsx' // 1. IMPORTE O PROVEDOR (Faltava)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 2. ENVOLVA O <App> com o <AuthProvider> (Faltava) */}
=======
import { AuthProvider } from './context/AuthContext.jsx' 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>

>>>>>>> 36459763d99eeb273565214ac8a8f965078ce46d
      <AuthProvider> 
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)