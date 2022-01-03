var express = require('express');
var router = express.Router();
const db = require('../db');
const User = require('../models/UserModel')
const {
    check,
    body,
    validationResult
} = require('express-validator');

router.post('/login', [body('email').not().isEmpty().isEmail(),
    body('password').not().isEmpty().isLength({
        min: 5
    })]
    ,async function(req,res,next){
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors)
        res.sendStatus(500)
    }else{
        var email=req.body.email
        var password=req.body.password

        let user=await User.getByEmail(email)
        if(user.verifyPassword(password)){
            console.log(user)
            req.session.user=user
            res.sendStatus(200)
        }else{
            res.sendStatus(401)
        }

    }
})

router.get('/logged-in', function(req, res, next){
    if(req.session.user != undefined){
        console.log("Role: "+req.session.user.role)
        res.json({loggedIn: true, role: req.session.user.role});
    }else{
        res.json({loggedIn: false, role: ""});
    }
})


module.exports=router