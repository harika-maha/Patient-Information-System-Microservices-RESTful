const express = require('express');
const dotenv = require('dotenv');
const middlewareRoutes = require('./src/routes/middlewareRoutes');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/middleware', middlewareRoutes);

const PORT = process.env.MIDDLEWARE_PORT || 6000;
app.listen(PORT, () => {
  console.log('Middleware Service running on port ${PORT}');
});
