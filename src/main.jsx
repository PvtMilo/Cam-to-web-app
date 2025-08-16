import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';
import { CaptureProvider } from './state/CaptureContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <CaptureProvider>
        <App />
      </CaptureProvider>
    </HashRouter>
  </React.StrictMode>
);