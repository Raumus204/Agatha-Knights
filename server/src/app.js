import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import db from './config/Connection.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = process.env.PORT || 3001;
console.log(`PORT from environment variable: ${process.env.PORT}`); // Log the PORT value

const app = express();

// Enable CORS using CLIENT_ORIGIN (Render) or localhost fallback
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const corsOptions = {
  origin: clientOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../../dist')));

// API routes
app.use('/api', routes);

// Serve the index.html file for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
});

db().then(() => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
}).catch(error => {
  console.error('Failed to connect to the database:', error);
});