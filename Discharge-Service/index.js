const express = require('express')
const dotenv = require('dotenv').config()
// const mongoose = require('mongoose')

const dbConnect = require('./src/config/dbConnect')
// const Discharge = require('./src/models/dischargeModel')
const dischargeRoutes = require('./src/routes/dischargeRoutes')

const app = express()
app.use(express.json())

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