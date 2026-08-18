const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: 'EcoCampus API is running smoothly!' });
});

// Import Routes
const authRoutes = require('./routes/auth');
const auditsRoutes = require('./routes/audits');
const leaderboardRoutes = require('./routes/leaderboard');
const pledgesRoutes = require('./routes/pledges');
const feedRoutes = require('./routes/feed');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/audits', auditsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/pledges', pledgesRoutes);
app.use('/api/feed', feedRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
