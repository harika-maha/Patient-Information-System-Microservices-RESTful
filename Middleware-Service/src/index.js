const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.json());

const PORT = process.env.MIDDLEWARE_PORT || 6000;
app.listen(PORT, () => {
  console.log(`Middleware Service running on port ${PORT}`);
});