import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SearchContextProvider } from './context/SearchContext';
import {SocketProvider} from './context/SocketContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <SearchContextProvider>
      <SocketProvider>
      <App />
      </SocketProvider>
    </SearchContextProvider>

  </React.StrictMode>
);