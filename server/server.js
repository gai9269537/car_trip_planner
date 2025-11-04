import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDatabase } from './database/db.js';
import { router as authRouter } from './routes/auth.js';
import { router as tripsRouter } from './routes/trips.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
getDatabase();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/trips', tripsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Car Trip Planner API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database initialized`);
});

