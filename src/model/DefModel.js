const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const authSchema = new mongoose.Schema({
    email : {
        type : String,
        unique : true,
        required : [true, "Email must be provided"],
        validator(value){
            if(! validator.isEmail(value)){
                throw new Error("Please provide valid Email")
            }           
        }
    },
    password : {
        type : String,
        required : [true, "Password must be provided"],
        minlength : [5, "Password must be 5 characters long"]
    }
})

authSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

authSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw new Error("Invalid Credentials")  ;
    }
    throw new Error("No Such User");
}

const AuthSystem = mongoose.model("data", authSchema);

module.exports = AuthSystem;