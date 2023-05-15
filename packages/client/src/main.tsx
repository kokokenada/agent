import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes } from './Routes';
import setupLocatorUI from '@locator/runtime';
// import './styles.module.scss';

export const isLocal = () => {
  return location.hostname === 'localhost';
};

if (isLocal()) {
  setupLocatorUI();
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
);
