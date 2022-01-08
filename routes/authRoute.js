var express = require('express');
var router = express.Router();
const db = require('../db');
const User = require('../models/UserModel')
const bcrypt = require('bcrypt')
const {
    check,
    body,
    validationResult
} = require('express-validator');

router.post('/login', [
    body('email').not().isEmpty().isEmail(),
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
        let validPassword= await bcrypt.compare(password,user.password)
        if(validPassword){
            console.log(user)
            req.session.user=user
            res.sendStatus(200)
        }else{
            res.sendStatus(401)
        }

    }
})

router.post('/register',[
    body('email').not().isEmpty().isEmail(),
    body('firstName').not().isEmpty(),
    body('lastName').not().isEmpty(),
    body('password').not().isEmpty(),
    body('jmbag').not().isEmpty().isLength({min: 10, max: 10})
],async function (req,res,next){
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors)
        res.sendStatus(500)
    }else{
        const{email,password,firstName,lastName,jmbag}=req.body
        console.log(email,password,firstName,lastName,jmbag)
        const user = new User(email, password,'student',null,jmbag,firstName,lastName)
        console.log(user.email)
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(user.password,salt)

        await user.saveStudent()
        req.session.user=user
        res.sendStatus(200)
    }
});

router.post('/logout',async function (req,res,next){
    try {
        req.session.destroy()
        res.sendStatus(200)
    }catch {
        res.sendStatus(500)
    }
});

router.get('/logged-in', function(req, res, next){
    if(req.session.user != undefined){
        console.log("Role: "+req.session.user.role)
        res.json({loggedIn: true, role: req.session.user.role});
    }else{
        res.json({loggedIn: false, role: ""});
    }
})


module.exports=router