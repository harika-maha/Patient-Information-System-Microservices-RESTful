const mongoose = require("mongoose")
const dotenv = require("dotenv").config()

const uri = process.env.AUTH_DB_URI

const dbConnect = async () => {
    try{
        const con = await mongoose.connect(uri)
        console.log(`DB connection successful ${con.connection.host}, DB: ${con.connection.db.databaseName}`)
    }
    catch(err){
        console.log("Error connecting to Database!", err)
    }
}

module.exports = dbConnect