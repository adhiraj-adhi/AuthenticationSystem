const AuthSystem = require("../src/model/DefModel");
const jwt = require('jsonwebtoken');
require('dotenv').config();

let errorMessage = {
    loginError : '',
    email: '',
    password: ''
}

// create token method
const createToken = (id) => {
    return jwt.sign({ id }, process.env.PRIVATE_KEY, { expiresIn: '3d' })
}


//  handling errors
const handleError = (err) => {
    if (err.message === 'Passwords must be same') {
        errorMessage.password = 'Passwords must be same'
    }
    if (err.message.includes('data validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errorMessage[properties.path] = properties.message;
        })
    }
    if (err.code === 11000) {
        errorMessage.email = 'Email Already Registered'
    }
    if(err.message === 'No Such User'){
        errorMessage.loginError = 'No Such User'
    }
    if(err.message === 'Invalid Credentials'){
        errorMessage.loginError = 'Invalid Credentials'
    }
}


const signIn_get = (req, res) => {
    res.render("signIn", { data: errorMessage })
}

const signup_get = (req, res) => {
    res.render("signUp", { data: errorMessage });
}


const signup_post = async (req, res) => {
    // console.log(req.body);
    try {
        if (req.body.password === req.body.confPassword) {
            const data = req.body;
            console.log(data);
            const userData = new AuthSystem({
                email: data.email,
                password: data.password
            });
            const result = await userData.save();
            // console.log("Ressssssssssssultttt : "+result);
            // console.log(result._id.valueOf());
            const token = createToken(result._id.valueOf());
            // console.log("Tokeeeeeeeeeeeeeeeeeeeennn ",token);
            res.cookie('userLoggedIn', token, { maxAge: 1000 * 60 * 60 * 24 * 3, httpOnly: true })
            res.render("Home");
        } else {
            throw new Error("Passwords must be same");
        }
    } catch (error) {
        handleError(error);
        res.render("signUp", { data: errorMessage })
    }
}

const login_post = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await AuthSystem.login(email, password);
        const token = createToken(user._id);
        res.cookie('userLoggedIn', token, { maxAge: 1000 * 60 * 60 * 24 * 3, httpOnly: true });
        res.redirect("/home");
    } catch (error) {
        handleError(error);
        res.render("signIn", { data : errorMessage })
    }
}

const getHomePage = (req,res) => {
    res.render("Home");
}

const getTestPage = (req,res) => {
    res.render("Test");
}

module.exports = {
    signIn_get,
    signup_get,
    signup_post,
    login_post,
    getHomePage,
    getTestPage
}