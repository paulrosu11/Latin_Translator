
import { app } from './run_express';
import { TranslateRequest, TranslateResponse } from '../shared/types';
import { translate_latin_openai } from './translate';

app.post('/api/translate', async (req, res) => {
  const { text } = req.body as TranslateRequest;

  try {
    const translation = await translate_latin_openai(text);
    const response: TranslateResponse = { translation };
    res.json(response);
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

