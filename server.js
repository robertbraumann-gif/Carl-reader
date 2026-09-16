import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.disable('x-powered-by');
app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));

app.get('/api/health', (req,res) => res.json({ ok:true, openaiConfigured:Boolean(process.env.OPENAI_API_KEY) }));

app.post('/api/translate', async (req,res) => {
  try {
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error:'OPENAI_API_KEY ist nicht konfiguriert.' });
    if (process.env.READER_PASSWORD && req.get('x-reader-password') !== process.env.READER_PASSWORD) return res.status(401).json({ error:'Reader-Passwort falsch.' });
    const text = String(req.body?.text || '').trim();
    if (!text) return res.status(400).json({ error:'Kein Text übergeben.' });
    if (text.length > 10000) return res.status(413).json({ error:'Textblock zu lang.' });
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.6-terra',
      instructions: 'Übersetze italienischen Romantext in natürliches, flüssiges literarisches Deutsch. Bewahre trockenen schwarzen Humor, vulgäre Sprache, individuelle Figurenstimmen, Großschreibung in Chats sowie RPG-, Achievement- und Systemmeldungen. Eigennamen unverändert. Terminologie innerhalb des Textes konsistent halten. Keine Erklärung, keine Zusammenfassung, nur die deutsche Übersetzung.',
      input: text
    });
    if (!response.output_text) throw new Error('OpenAI lieferte keinen Übersetzungstext.');
    res.json({ translation: response.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.message || 'Übersetzung fehlgeschlagen.' });
  }
});

app.get('*', (req,res) => res.sendFile(path.join(__dirname,'public','index.html')));
const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => console.log(`Carl Reader listening on ${port}`));
