import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './main.css';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import { MantineProvider } from '@mantine/core';
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <MantineProvider>
      <Auth0Provider
        domain="dev-8ey6pfp5cskacl7c.us.auth0.com"
        clientId="twj9UnkcaBzQmFD8yyiG7uRtQNBQ8Dff"
        cacheLocation="localstorage"
        authorizationParams={{
          redirect_uri: window.location.origin + '/login-redirect',
        }}
      >
        <App />
      </Auth0Provider>
    </MantineProvider>
  // </React.StrictMode>,
);
