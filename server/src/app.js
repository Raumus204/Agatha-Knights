import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index.js';
import db from './config/Connection.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 3001;
console.log(`PORT from environment variable: ${process.env.PORT}`);

// Initialize Express
const app = express();

// Serve static files (for fonts, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Use helmet for security with custom CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: [
          "'self'", 
          "data:", 
          "https://fonts.gstatic.com", 
          "https://agatha-knights-game.onrender.com", 
          "https://stackpath.bootstrapcdn.com",  // Allow fonts from Bootstrap's CDN
          "https://fonts.googleapis.com",      // Allow fonts from Google Fonts
          ],
        imgSrc: ["'self'", "data:", "https://agatha-knights-game.onrender.com"],
        connectSrc: ["'self'", "https://agatha-knights-game.onrender.com"],
        mediaSrc: ["'self'", "https://agatha-knights-game.onrender.com"],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

// Start Server
db().then(() => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
}).catch(error => {
  console.error('Failed to connect to the database:', error);
});


// Helmet sets the following headers by default:

// Content-Security-Policy: A powerful allow-list of what can happen on your page which mitigates many attacks
// Cross-Origin-Opener-Policy: Helps process-isolate your page
// Cross-Origin-Resource-Policy: Blocks others from loading your resources cross-origin
// Origin-Agent-Cluster: Changes process isolation to be origin-based
// Referrer-Policy: Controls the Referer header
// Strict-Transport-Security: Tells browsers to prefer HTTPS
// X-Content-Type-Options: Avoids MIME sniffing
// X-DNS-Prefetch-Control: Controls DNS prefetching
// X-Download-Options: Forces downloads to be saved (Internet Explorer only)
// X-Frame-Options: Legacy header that mitigates clickjacking attacks
// X-Permitted-Cross-Domain-Policies: Controls cross-domain behavior for Adobe products, like Acrobat
// X-Powered-By: Info about the web server. Removed because it could be used in simple attacks
// X-XSS-Protection: Legacy header that tries to mitigate XSS attacks, but makes things worse, so Helmet disables it