import axios from 'axios';

export const prodApi = axios.create({
  baseURL: 'https://demo-app-2026-v0-0-1.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const devApi = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});