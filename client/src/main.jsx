import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import { ProjectProvider } from './context/ProjectContext.jsx';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import ToasterProvider from './components/Providers/ToasterProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <ProjectProvider>
          <ThemeProvider>
            <BrowserRouter>
              <App />
              <ToasterProvider />
            </BrowserRouter>
          </ThemeProvider>
        </ProjectProvider>
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>,
)
