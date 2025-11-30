// frontend/src/index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { setAuthToken } from "./api";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const token = localStorage.getItem("token");
if (token) setAuthToken(token);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
