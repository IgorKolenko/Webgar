var express = require('express');
var router = express.Router();
const db = require('../db');

var evaluator=require('eval');
const {raw} = require("express");

router.get('/jsTesting',function (req,res,next){
    // Mock testcase
    let testcase = {
        imeFunkcije: "f1",
        input:"a,b",
        output: "ab"
    };
    // Mock function
    let fjaTest="function f1(p1,p2){\n" +
        "p3=p1+p2;\n" +
        "return p3;\n" +
        "}"

    //TODO Check incorrect function name

    // Check input for Numbers
    var rawInput=testcase.input.split(',')
    rawInput.forEach(function(element,i){
        if(!isNaN(element)){
            rawInput[i]=Number(element)
        }
    })

    // Find function declaration
    let fIndex=fjaTest.search("function "+testcase.imeFunkcije);
    // Add module.exports to start
    let formattedFunction=fjaTest.slice(0,fIndex)+" module.exports = "+fjaTest.slice(fIndex)


    // Get Function result
    var result=evaluator(formattedFunction)(...rawInput)
    console.log(result)

    if (result==testcase.output){
        console.log("SUCCESS")
    }else{
        console.log("FAIL")
    }


    res.json({ok:true});
});

module.exports= router