const express = require('express')
const dotenv = require('dotenv').config()

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
// const mongoose = require('mongoose')


// Swagger JSDoc setup
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Discharge Service',
      version: '1.0.0',
      description: 'This is the API documentation for Discharge service',
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
  


const dbConnect = require('./src/config/dbConnect')
// const Discharge = require('./src/models/dischargeModel')
const dischargeRoutes = require('./src/routes/dischargeRoutes')

const app = express()
app.use(express.json())

  // Use swagger-ui-express to serve the Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/discharge', dischargeRoutes)

const port = process.env.PORT



const start = async () => {
    try{
        await dbConnect()
        app.listen(port, ()=>{
            console.log(`Listening to port: ${port}`)
        })
    }
    catch(error){
        console.log(`Server error: ${error}`);
    }
}

const dbTest = async () => {
    try {
        await dbConnect()
        // if (mongoose.connection.readyState !== 1) {
        //     throw new Error('MongoDB not connected. Current state: ' + mongoose.connection.readyState);
        //   }
  
        // const dischargeSummary = await Discharge.create({
        //   patientId: "P123456",
        //   patientDetails: {
        //     firstname: "John",
        //     lastname: "Doe",
        //     age: 45,
        //     department: "Medicine"
        //   },
        //   doctorId: "D789012",
        //   homeCarePlan: "Rest for 2 weeks, follow up in OPD after 10 days",
        //   medications: [
        //     {
        //       name: "Paracetamol",
        //       dosage: "500mg",
        //       frequency: "3 times a day"
        //     },
        //     {
        //       name: "Amoxicillin",
        //       dosage: "250mg",
        //       frequency: "twice daily"
        //     }
        //   ],
        //   status: "draft",
        //   referrals: [
        //     {
        //       department: "Orthopedics",
        //       serviceType: "Physiotherapy",
        //       notes: "Need physiotherapy sessions",
        //       status: "SCHEDULED"
        //     }
        //   ]
        // });

        // console.log("Created discharge summary:", dischargeSummary);

    }
    catch(err){
        console.log("Error: ", err)
    }
}
// dbTest()
start()