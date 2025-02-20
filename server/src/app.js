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

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

db().then(() => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
}).catch(error => {
  console.error('Failed to connect to the database:', error);
});