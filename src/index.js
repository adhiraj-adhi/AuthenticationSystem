const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

const path = require('path');

//  setting up cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// =======================================

app.use(express.json());
app.use(express.urlencoded({extended : false}))



// ========================= configuring router ================================
const router = require("../routes/router")
app.use("/", router);

app.use(express.static(path.join(__dirname, '../public')))  // always use this after configuring router




// =======================  setting views path ==================================
const viewsPath = path.join(__dirname, "../templates/views");
app.set('view engine', 'ejs');
app.set('views', viewsPath);

// ===================  setting up database connection ===========================
require('dotenv').config();
const url = process.env.MONGO_URL;
const Connection = require("./db/Connection");
const DBConnection = async (req, res) => {
    try {
        const result = await Connection(url);
        if (result !== "undefined") {
            // app.listen(port, console.log(`Listening to port at ${port}`));
            app.listen(port, console.log(`http://localhost:${port}`));
        } else {
            console.log("Connection Failed");
        }
    } catch (error) {
        console.log(error);
    }
}

DBConnection();