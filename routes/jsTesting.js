var express = require('express');
var router = express.Router();
const db = require('../db');
const fs = require('fs');

var evaluator = require('eval');

async function testFunction(testcase, taskSolution){
    //Format testcase data
    let testcaseData=JSON.parse(testcase.json)
    // Check input for Numbers
    let rawInput = testcaseData.input.split(',')
    rawInput.forEach(function (element, i) {
        if (!isNaN(element)) {
            rawInput[i] = Number(element)
        }
    })

    // Get file function from taskSolution
    let functionText=taskSolution.file

    // Find function declaration
    var regex = new RegExp("function\\s+" + testcaseData.imeFunkcije + "\\s*\\(")
    let fIndex = functionText.search(regex);

    // Add module.exports to start
    if (fIndex !== -1) {
        let formattedFunction = functionText.slice(0, fIndex) + " module.exports = " + functionText.slice(fIndex)

        // Get Function result
        var result = evaluator(formattedFunction)(...rawInput)
        // console.log(result)

        // Test Result
        if (result == testcaseData.output) {
            // Rezultat ispravan
            await db.insertResult(1, testcase.idtestcase,taskSolution.idriješenizadatak)
            console.log("SUCCESS")
        } else {
            //Rezultat neispravan
            await db.insertResult(0,testcase.idtestcase,taskSolution.idriješenizadatak)
            console.log("FAIL")
        }
    } else {
        // Nije se nasla funkcija → rezultat neispravan
        await db.insertResult(0, testcase.idtestcase,taskSolution.idriješenizadatak)
        console.log("FAIL")
    }
}


router.get('/jsTesting', async function (req, res, next) {
    // Mock testcase
    // let testcase = {
    //     imeFunkcije: "f1",
    //     input:"1,2",
    //     output: "3"
    // };
    //TODO Hardcoded zadatak id
    let allTestcases=await db.getTestcase(1)

    //TODO Hardcoded idrijesenzadatak
    let taskSolution=await db.getSolution(2)
    // console.log(taskSolution.file)

    for(let item of allTestcases){
        // console.log(item)
        await testFunction(item,taskSolution)
    }
    // allTestcases.forEach(item=>{
    //     let testcase=JSON.parse(item.json)
    //     testFunction(testcase,taskSolution)
    // })


    res.json({ok: true});
});

module.exports = router