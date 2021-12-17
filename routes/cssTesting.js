var express = require('express');
var router = express.Router();
const db = require('../db');
const fs = require('fs');

router.post('/cssTesting', async function (req, res, next) {
    console.log("Entering css testing");

    let idzadatak=req.body.taskID
    let jmbag=req.body.jmbag
    let solvedTaskID=req.body.solvedTaskID
    let testcases = await db.getTestcase(idzadatak)
    // let taskSolution = await db.getLastSolution(idzadatak, jmbag)
    let taskSolution=await db.getSolution(solvedTaskID)

    let idRijesenZadatak = taskSolution.idriješenizadatak

    let data = taskSolution.file
    //parsiranje css datoteke
    data = data.replace((/  |\r\n|\n|\r/gm), "");
    let propArr = [];
    let temp = ""
    for (let i = 0; i < data.length; i++) {
        if (data[i] == '}') {
            temp += '}';
            propArr.push(temp);
            temp = "";
        } else {
            temp += data[i];
        }
    }
    var output = {};
    let elName = "";
    let propName = "";
    let propVal = "";
    for (var k of propArr) {
        let status = "element";
        elName = "";
        for (let i = 0; i < k.length; i++) {
            if (status == "element") {
                if (k[i] == '{') {
                    output[elName] = {};
                    status = "propName"
                } else {
                    elName += k[i];
                }
            } else if (status == "propName") {
                if (k[i] == ':') {
                    status = "propVal";
                } else if (k[i] != '}') {
                    propName += k[i];
                }
            } else {
                if (k[i] == ';') {
                    propVal = propVal.trim();
                    output[elName][propName] = propVal;
                    propName = "";
                    propVal = "";
                    status = "propName";
                } else {
                    propVal += k[i];
                }
            }
        }
    }
    // console.log(propArr);
    // console.log(output);

    let resultsArr = [];

    //prolaženje kroz sve testcase-ove
    for (var testcase of testcases) {
        let testcaseJson = JSON.parse(testcase.json);
        testcaseJson.svojstva = testcaseJson.svojstva.replace((/  |\r\n|\n|\r/gm), "");
        console.log("Json: " + testcaseJson.svojstva);

        //parsiranje svojstva iz testcase-a
        let svojstva = {}
        let status = "propName";
        propName = "";
        propVal = "";
        for (let i = 0; i < testcaseJson.svojstva.length; i++) {
            if (status == "propName") {
                if (testcaseJson.svojstva[i] == ':') {
                    status = "propVal";
                } else if (testcaseJson.svojstva[i] != '}') {
                    propName += testcaseJson.svojstva[i];
                }
            } else {
                if (testcaseJson.svojstva[i] == ';') {
                    propVal = propVal.trim();
                    svojstva[propName] = propVal;
                    propName = "";
                    propVal = "";
                    status = "propName";
                } else {
                    propVal += testcaseJson.svojstva[i];
                }
            }
        }

        //testiranje pomocu testcase-a
        var bool = true;
        if (testcaseJson.imeElementa in output) {
            let brSvojstva = 0
            for (const [key, value] of Object.entries(svojstva)) {
                brSvojstva++;
                if (!(key in output[testcaseJson.imeElementa] && value == output[testcaseJson.imeElementa][key])) {
                    bool = false;
                    break;
                }
            }
            if (testcaseJson.checkbox && bool == true) {
                if (Object.keys(output[testcaseJson.imeElementa]).length == brSvojstva) {
                    bool = true;
                } else {
                    bool = false;
                }
            }
            resultsArr.push([testcase.idtestcase, bool]);
        } else {
            resultsArr.push([testcase.idtestcase, false]);
        }
    }

    // let idrijesenizadatak = await db.query("INSERT INTO riješenizadatak (file, uploaddate, jmbag, idzadatak) VALUES ($1, $2, '0036123456', $3) RETURNING idriješenizadatak", [data, new Date(), idzadatak])
    // idrijesenizadatak = idrijesenizadatak.rows[0]["idriješenizadatak"];
    // console.log(resultsArr);
    // console.log(idrijesenizadatak);
    for (let rez of resultsArr) {
        console.log("Rezultat: " + rez[1]);
        if (rez[1]) {
            await db.insertResult(1, parseInt(rez[0]), idRijesenZadatak);
        } else {
            await db.insertResult(0, parseInt(rez[0]), idRijesenZadatak);
        }
    }

    res.send(resultsArr);

    // }
});
/*
let testcase = {
    imeElementa: ".testClass",
    svojstva:"background-color: green;border: 5px solid red;margin: 20px;padding: 10px;",
    checkbox: false
};
*/
// });

module.exports = router;