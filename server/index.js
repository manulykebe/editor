import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// File operations endpoints
app.get('/api/files', (req, res) => {
  res.json({ files: [] });
});

app.post('/api/files', (req, res) => {
  res.json({ message: 'File created' });
});

app.put('/api/files/:id', (req, res) => {
  res.json({ message: 'File updated' });
});

app.delete('/api/files/:id', (req, res) => {
  res.json({ message: 'File deleted' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});