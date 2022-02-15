const express = require('express');

//// DB
const mongoose = require('mongoose');

////// imported Middlewars
const bodyParser = require('body-parser');

//import Models

//import Routes file
const postsRoutes = require('./routes/posts');


////////////////////////////////////////////////////////////////
/////////////////////////////// APP ////////////////////////////
////////////////////////////////////////////////////////////////

const app = express();

////connect to mongoDB
//connect to mongoose
mongoose.connect("mongodb+srv://maher2:ababab@cluster0.rtgkm.mongodb.net/mata?retryWrites=true&w=majority")
    .then(() => console.log('Mongodb connected successfully!'))
    .catch(err => console.log(err));

///////////////////////// MIDDLEWARES ///////////////////////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PATCH, PUT, DELETE");
    next();
})

///////////Routes
app.use('/api/posts',postsRoutes);



////////// Listening
module.exports = app;
