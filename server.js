const express = require('express');
const app = express();

//Configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Routes
app.use('/',require('./routes/taskTestcases'))


app.get('/',(req,res)=>{
    res.send('Express App');
});


app.listen(3000,()=>{
    console.log(`Server running on port: 3000`)
});