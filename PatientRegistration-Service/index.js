require('dotenv').config();
const express = require('express');
const mongoose = require('./src/config/dbConnect');
const patientRoutes = require('./src/routes/patientRoutes');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

mongoose();

app.use('/api/patients', patientRoutes);

const PORT = process.env.PATIENT_SERVICE_PORT || 5001;
app.listen(PORT, () => console.log('Patient Service running on port ${PORT}'));
