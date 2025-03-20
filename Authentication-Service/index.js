const express = require("express")
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const dotenv = require("dotenv").config()

const dbConnect = require("./src/config/dbConnect")


const port = process.env.PORT
const app = express()

const authRoutes = require('./src/routes/authRoutes');

// Swagger JSDoc setup
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Authentication Service',
      version: '1.0.0',
      description: 'This is the API documentation for Authentication service',
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
        url: 'http://localhost:3001/api/auth',
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


app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(port, ()=>{
    console.log(`listening to port ${port}`)
})

// function to test the db operations
const dbTest = async () => {
    try{
        await dbConnect()
       /* console.log("Add user operation");
        const newUser = await userModel.addUser({employeeId: "D1", username: "user1", password: "pass1", role: "doctor", firstName: "fname", lastName: "lname", department: "Surgery"})
        console.log(`Added user: ${newUser}`);*/

        // console.log("Find user operation");
        // const userFound = await userModel.findUser({username: "user1"})
        // console.log(`Found user: ${userFound.firstName}`);
        
        // console.log("Delete user operation");
        // const userDeleted = await userModel.deleteUser({employeeId: "D1"})
        // console.log(`User deleted: ${userDeleted.firstName}`);
    }
    catch(err){
        console.log("Error: ", err)
    }
}
dbTest()


