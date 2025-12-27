const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Auth Routes
app.use('/api/auth', authRoutes);

// 3. Simple Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// 4. Start Server (Only if running locally)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// 5. Export for Vercel
// Since you used 'require' above, use 'module.exports' here
module.exports = app;