const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const uri = process.env.URI

const dbConnect = async () => {
    try{
        console.log(uri)
        const con = await mongoose.connect(uri)
        console.log(`DB connection successful ${con.connection.host}, DB: ${con.connection.db.databaseName}`)
    }
    catch(err){
        console.log("Error connecting to Database!", err)
    }
}

module.exports = dbConnect