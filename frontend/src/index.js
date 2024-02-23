import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/input.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-723z7f5wvs37uaci.us.auth0.com"
      clientId="NZxQiAnza9H3fTGYfyYVCY42wrBofRR4"
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
