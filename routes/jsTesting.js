var express = require('express');
var router = express.Router();
const db = require('../db');
const fs = require('fs');

var evaluator=require('eval');

router.get('/jsTesting',function (req,res,next){
    // Mock testcase
    let testcase = {
        imeFunkcije: "f1",
        input:"1,2",
        output: "3"
    };

    //TODO Check incorrect function name


    // Check file
    fs.readFile('../ProjektR/routes/test.js','utf8',(err,data)=>{
        if (err) {
            console.error(err)
            return
        }
        // File data
        let fjaTest=data
        // console.log(data)

        // Check input for Numbers
        var rawInput=testcase.input.split(',')
        rawInput.forEach(function(element,i){
            if(!isNaN(element)){
                rawInput[i]=Number(element)
            }
        })

        // Find function declaration
        var regex= new RegExp("function\\s+"+testcase.imeFunkcije+"\\s*\\(")
        let fIndex=fjaTest.search(regex);
        // console.log(fIndex)
        // Add module.exports to start
        if(fIndex!==-1) {
            let formattedFunction = fjaTest.slice(0, fIndex) + " module.exports = " + fjaTest.slice(fIndex)

            // Get Function result
            var result = evaluator(formattedFunction)(...rawInput)
            // console.log(result)

            // Test Result
            if (result == testcase.output) {
                console.log("SUCCESS")
            } else {
                console.log("FAIL")
            }
        }else{
            console.log("Can't find function")
        }
    })


    // Check String
    // Mock function
    // let fjaTest="function f1(p1,p2){\n" +
    //     "p3=p1+p2;\n" +
    //     "return p3;\n" +
    //     "}"

    // // Check input for Numbers
    // var rawInput=testcase.input.split(',')
    // rawInput.forEach(function(element,i){
    //     if(!isNaN(element)){
    //         rawInput[i]=Number(element)
    //     }
    // })
    //
    // // Find function declaration
    // let fIndex=fjaTest.search("function "+testcase.imeFunkcije);
    // // Add module.exports to start
    // let formattedFunction=fjaTest.slice(0,fIndex)+" module.exports = "+fjaTest.slice(fIndex)
    //
    //
    // // Get Function result
    // var result=evaluator(formattedFunction)(...rawInput)
    // console.log(result)
    //
    // if (result==testcase.output){
    //     console.log("SUCCESS")
    // }else{
    //     console.log("FAIL")
    // }

    res.json({ok:true});
});

module.exports= router