const express = require('express');
const path = require('path');

//// DB
const mongoose = require('mongoose');

////// imported Middlewars
const bodyParser = require('body-parser');

//import Models

//import Routes file
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');


////////////////////////////////////////////////////////////////
/////////////////////////////// APP ////////////////////////////
////////////////////////////////////////////////////////////////

const app = express();

////connect to mongoDB
//connect to mongoose
mongoose.connect("mongodb+srv://maher2:ababab@cluster0.rtgkm.mongodb.net/mata?retryWrites=true&w=majority")
    .then(() => console.log('Mongodb connected successfully!'))
    .catch(err => console.log(err));

//public media
app.use("/images",express.static(path.join('backend/images')));


///////////////////////// MIDDLEWARES ///////////////////////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PATCH, PUT, DELETE");
    next();
})

///////////Routes
app.use('/api/posts', postsRoutes);
app.use('/api/users', userRoutes);



////////// Listening
module.exports = app;
