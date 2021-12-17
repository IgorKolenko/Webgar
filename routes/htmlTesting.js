var express = require('express');
var router = express.Router();
const db = require('../db');
const jsdom = require("jsdom");

function test(testcase, taskSolution) {
    let data = taskSolution.file
    const dom = new jsdom.JSDOM(data)
    const doc = dom.window.document
    let testcaseJSON = JSON.parse(testcase.json)
    let prolaz = false;

    if(testcase.vrstatestcase == "htmlStrukture") {
        let parents = doc.querySelectorAll(testcaseJSON.imeRoditelja)
        let selector = ":scope >" + testcaseJSON.imeDjeteta

        for(const parent of parents) {
            let count = parent.querySelectorAll(selector).length
            //console.log(count)
    
            if(count == testcaseJSON.brPojavljivanja) {
                prolaz = true
                break
            }
        }

        return prolaz

    } else if(testcase.vrstatestcase == "htmlSvojstva") {
        let elements = doc.querySelectorAll(testcaseJSON.imeElementa)
        let array = testcaseJSON.svojstva.split("\n").map(x => [x.split("=")[0], x.split("=")[1]])
        let map = new Map(array)

        // sadrži li sva potrebna svojstva
        for(const element of elements) {
            //console.log(element.attributes.length)
            for(const [key, value] of map.entries()) {
                let attr = element.attributes.getNamedItem(key)
                if(attr != null && attr.value == value) {
                    prolaz = true
                } else {
                    prolaz = false
                    break
                }
            }

            if(prolaz) {
                // sadrži li SAMO navedena svojstva (+1 za klasu ili id pomoću čega smo našli element)
                if(testcaseJSON.checkbox == true && element.attributes.length > map.size + 1) {
                    prolaz = false
                } else {
                    break
                }
            } 
        }

        return prolaz
    }
}

router.post('/htmlTesting', async function(req, res, next){
    let idZadatak=req.body.taskID
    let jmbag=req.body.jmbag

    let testcases = await db.getTestcase(idZadatak)
    //console.log(testcases)
    let taskSolution = await db.getLastSolution(idZadatak, jmbag)
    //console.log(taskSolution.file)

    for(let testcase of testcases) {
        let prolaz = test(testcase, taskSolution)

        if(prolaz) {
            await db.insertResult(1, testcase.idtestcase, taskSolution.idriješenizadatak)
            console.log("SUCCESS")
        } else {
            await db.insertResult(0, testcase.idtestcase, taskSolution.idriješenizadatak)
            console.log("FAIL")
        }
    }

    res.send("DONE")
});

module.exports= router