const express = require('express')
const dotenv = require('dotenv').config()

const dbConnect = require('./src/config/dbConnect')

const app = express()
app.use(express.json())

const port = process.env.PORT

app.listen(port, ()=>{
    console.log(`Listening to port: ${port}`)
})

const dbTest = async () => {
    try{
        await dbConnect()

    }
    catch(err){
        console.log("Error: ", err)
    }
}
dbTest()