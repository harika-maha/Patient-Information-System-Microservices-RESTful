const express = require('express');
const dotenv = require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
// const mongoose = require('mongoose');

const dbConnect = require('./src/config/dbConnect');
// const Treatment = require('./src/models/treatmentModel');
const treatmentRoutes = require('./src/routes/treatmentRoutes');

const app = express();
app.use(express.json());
// Swagger JSDoc setup
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Treatment Service',
      version: '1.0.0',
      description: 'This is the API documentation for Treatment service',
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
          url: process.env.TREATMENT_BASE_URL,  // Use environment variable if available
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
  
  // Use swagger-ui-express to serve the Swagger docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api/treatment', treatmentRoutes);

  // Use swagger-ui-express to serve the Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.TREATMENT_PORT || 5000;

const start = async () => {
    try {
        await dbConnect();
        app.listen(port, () => {
            console.log(`Listening to port: ${port}`);
        });
    } catch (error) {
        console.log(`Server error: ${error}`);
    }
};

const dbTest = async () => {
    try {
        await dbConnect();
        // if (mongoose.connection.readyState !== 1) {
        //     throw new Error('MongoDB not connected. Current state: ' + mongoose.connection.readyState);
        // }

        // const treatmentRecord = await Treatment.create({
        //   patientId: "P123456",
        //   patientDetails: {
        //     firstname: "John",
        //     lastname: "Doe",
        //     age: 45,
        //     department: "Medicine"
        //   },
        //   doctorId: "D789012",
        //   treatmentPlan: "Rest for 2 weeks, follow up in OPD after 10 days",
        //   prescriptions: [
        //     {
        //       name: "Paracetamol",
        //       dosage: "500mg",
        //       frequency: "3 times a day",
        //       duration: "5 days"
        //     },
        //     {
        //       name: "Amoxicillin",
        //       dosage: "250mg",
        //       frequency: "twice daily",
        //       duration: "7 days"
        //     }
        //   ],
        //   status: "ongoing",
        //   referrals: [
        //     {
        //       department: "Orthopedics",
        //       serviceType: "Physiotherapy",
        //       notes: "Need physiotherapy sessions",
        //       status: "SCHEDULED"
        //     }
        //   ]
        // });

        // console.log("Created treatment record:", treatmentRecord);
    } catch (err) {
        console.log("Error: ", err);
    }
};

// dbTest();
start();