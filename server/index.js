const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// 1. DYNAMIC CORS CONFIGURATION
// Add your actual Render frontend URL to this array
const allowedOrigins = [
  'http://localhost:5173', // Local Vite
  'https://web-store-project-1.onrender.com' // YOUR RENDER FRONTEND URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// 2. Auth Routes
app.use('/api/auth', authRoutes);

// 3. Simple Health Check for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is active' });
});

// 4. Safe Catch-all (Optional but helpful for debugging)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.status(404).send('API Route Not Found');
});

// 5. Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});