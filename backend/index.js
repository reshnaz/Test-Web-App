require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // stop server if DB connection fails
  });

// Test route to verify server is running
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Import auth routes and mount under /api/auth
app.use('/api/auth', require('./routes/auth'));
// import and use tasks routes:
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/profile', require('./routes/profile'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
