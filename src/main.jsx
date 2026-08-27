import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // Take my React application and put it inside <div id="root">.
import { BrowserRouter } from 'react-router-dom'; // This enables React Router.
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
