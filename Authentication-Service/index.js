const express = require("express")
const dotenv = require("dotenv").config()

const dbConnect = require("./src/config/dbConnect")


const port = process.env.PORT
const app = express()
app.use(express.json())


const authRoutes = require('./src/routes/authRoutes');
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


