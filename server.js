const express = require('express');
const app = express();
const pg = require('pg');
const db = require('./db');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');

//Configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    store: new pgSession({
        pool: db.pool,
        tableName: "session"
    }),
    secret: "nekaTajna",
    resave: false,
    saveUninitialized: false
}));
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static('client/build'));

//Routes
app.use('/tasks',require('./routes/taskTestcases'))
app.use('/auth',require('./routes/authRoute'))

//Ovo je za React rute
app.get('*', function(req, res){
    console.log("React ruta");
    res.sendFile(path.resolve('client', 'build', 'index.html'))
})


app.listen(3000,()=>{
    console.log(`Server running on port: 3000`)
});