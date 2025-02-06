const mongoose = require("mongoose")

const userSchema = require("./userSchema")

const User = mongoose.model('User', userSchema)

const addUser = async (userdata) => {
    const existingUsername = await User.findOne({ username: userdata.username });
    const existingId = await User.findOne({ employeeId: userdata.employeeId });
    //if username or ID already exists, throw an error
    if (existingUsername || existingId) {
      throw new Error(`User already exists!`);
    }
    const newUser = new User(userdata)
    //save the new user
    return await newUser.save()
}

const findUser = async (user) => {
    const userFound = await User.findOne(user)
    if(!userFound){
      throw new Error(`User ${user} does not exist!`);
    }
    return userFound
}

const deleteUser = async (user) => {
    const userFound = await User.findOneAndDelete(user)
    if(!userFound){
      throw new Error(`User does not exist!`);
    }
    return userFound
}


module.exports = { addUser, findUser, deleteUser }