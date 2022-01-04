var express = require('express');
var router = express.Router();
const db = require('../db');
const fs = require('fs');

var evaluator = require('eval');

async function testFunction(testcase, taskSolution){
    //Format testcase data
    let testcaseData=JSON.parse(testcase.json)
    // Check input for Numbers
    let testInput=testcaseData.input
    testInput = testInput.replace(/(\r\n|\n|\r)/gm, "");
    let rawInput = testInput.split(',')
    rawInput.forEach(function (element, i) {
        if (!isNaN(element)) {
            rawInput[i] = Number(element)
        }
    })
    console.log("INPUT\n"+rawInput)
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
        console.log("OUTPUT\n"+result)
        console.log("EXPECTED\n"+testcaseData.output)
        if (result == testcaseData.output) {
            // Rezultat ispravan
            await db.insertResult(testcase.idtestcase,taskSolution.idriješenizadatak, true)
            console.log("SUCCESS")
        } else {
            //Rezultat neispravan
            await db.insertResult(testcase.idtestcase,taskSolution.idriješenizadatak, false)
            console.log("FAIL")
        }
    } else {
        // Nije se nasla funkcija → rezultat neispravan
        await db.insertResult(testcase.idtestcase,taskSolution.idriješenizadatak, false)
        console.log("FAIL")
    }
}

async function testJS(taskID,student,solvedTask){
    let idZadatak=taskID
    let jmbag=student
    let solvedTaskID=solvedTask

    let allTestcases=await db.getTestcase(idZadatak)
    // let taskSolution = await db.getLastSolution(idZadatak, jmbag)
    let taskSolution=await db.getSolution(solvedTaskID)

    for(let item of allTestcases){
        await testFunction(item,taskSolution)
    }
}

module.exports = {
    testJS
}