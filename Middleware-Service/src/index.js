const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.json());

app.get('/test-auth', authMiddleware.verifyToken, (req, res) => {
  res.json({ message: 'JWT Authentication Successful', user: req.user });
});

const PORT = process.env.MIDDLEWARE_PORT || 6000;
app.listen(PORT, () => {
  console.log(`Middleware Service running on port ${PORT}`);
});