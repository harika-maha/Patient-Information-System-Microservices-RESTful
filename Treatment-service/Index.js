const express = require('express');
const dotenv = require('dotenv').config();
// const mongoose = require('mongoose');

const dbConnect = require('./src/config/dbConnect');
// const Treatment = require('./src/models/treatmentModel');
const treatmentRoutes = require('./src/routes/treatmentRoutes');

const app = express();
app.use(express.json());

app.use('/api/treatment', treatmentRoutes);

const port = process.env.PORT || 5000;

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