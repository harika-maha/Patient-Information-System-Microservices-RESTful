require('dotenv').config();
const express = require('express');
const mongoose = require('./src/config/dbConnect');
const patientRoutes = require('./src/routes/patientRoutes');
const cors = require('cors');
const axios = require('axios');

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger JSDoc setup
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Patient Registration Service',
      version: '1.0.0',
      description: 'This is the API documentation for Patient registration service',
    },
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
      servers: [
        {
          url: process.env.BASE_URL,  // Use environment variable if available
        },
    ],
  };
  
  
  // Define options for swagger-jsdoc
  const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'], // This will include all JavaScript files in the routes folder
  };
  
  // Initialize swagger-jsdoc
  const swaggerSpec = swaggerJSDoc(options);
mongoose();

  // Use swagger-ui-express to serve the Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Patient Service running on port ${PORT}`));
