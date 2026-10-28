import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

// Safety Analysis
export const analyzeSafety = async (imageFile, siteName, description) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('site_name', siteName);
  formData.append('description', description);
  const res = await api.post('/safety/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// Crack Analysis
export const analyzeCrack = async (imageFile, location, structureType) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('location', location);
  formData.append('structure_type', structureType);
  const res = await api.post('/crack/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// Planning
export const estimatePlanning = async (payload) => {
  const res = await api.post('/planning/estimate', payload);
  return res.data;
};

// Valuation
export const estimateValuation = async (payload) => {
  const res = await api.post('/valuation/analyze', payload);
  return res.data;
};

// Assistant Chat
export const chatWithAssistant = async (message, conversationHistory = []) => {
  const res = await api.post('/assistant/chat', {
    message,
    conversation_history: conversationHistory,
  });
  return res.data;
};

// Weather Advisory
export const getWeatherAdvisory = async (location, context = '') => {
  const res = await api.post('/assistant/weather', { location, context });
  return res.data;
};

export default api;
