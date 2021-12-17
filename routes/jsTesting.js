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


router.post('/jsTesting', async function (req, res, next) {
    let idZadatak=req.body.taskID
    let jmbag=req.body.jmbag
    let solvedTaskID=req.body.solvedTaskID

    let allTestcases=await db.getTestcase(idZadatak)
    // let taskSolution = await db.getLastSolution(idZadatak, jmbag)
    let taskSolution=await db.getSolution(solvedTaskID)

    for(let item of allTestcases){
        await testFunction(item,taskSolution)
    }

    res.json({ok: true});
});

module.exports = router