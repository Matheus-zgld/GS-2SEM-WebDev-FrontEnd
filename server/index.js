import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.warn('Aviso: GEMINI_API_KEY não encontrada no ambiente. Configure-a em .env');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

app.post('/api/gemini', async (req, res) => {
  const { prompt, model = 'gemini-2.5-flash-preview-09-2025' } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const m = genAI.getGenerativeModel({ model });
    const result = await m.generateContent(prompt);
    // Tenta extrair texto de forma segura
    const text = (result?.response && typeof result.response.text === 'function') ? result.response.text() : JSON.stringify(result);
    res.json({ text });
  } catch (err) {
    console.error('Erro no proxy Gemini:', err);
    res.status(500).json({ error: err?.message || 'Erro interno' });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini proxy server running on http://localhost:${PORT}`);
});
