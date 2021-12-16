var express = require('express');
var router = express.Router();
const db = require('../db');

router.post('/newSolution',async function(req,res,next){
    //TODO HARDCODED VARIABLES
    let file="TEMP";
    let jmbag="0036123456";
    let idzadatak="1";
    let uploaddate=new Date();
    try{
        await db.insertSolution(file,uploaddate,jmbag,idzadatak)
    }catch{
        res.sendStatus(500)
    }
    res.sendStatus(200)
});


// Post spremi zadatak i testcaseove u bazu
router.post('/addTask',async function (req,res,next){
    console.log("Dodavanje u bazu");
    //Body: imeZadatak,vrstaZadatak,opisZadatak
    const{imeZadatak,opisZadatak,vrstaZadatak, testcases}=req.body

    // Insert Task into database
    //TODO Currently Hardcoded profesorID
    let professorID
    let result=await db.query('INSERT INTO zadatak (imeZadatak,opisZadatak,idProfesor,idVrsta) VALUES($1,$2,$3,$4) RETURNING idzadatak',
        [imeZadatak, opisZadatak, professorID, vrstaZadatak]).catch(
        err=>{
            console.log(err)
            res.sendStatus(500)
        }
    );

    // Insert testcase into database
    console.log("res: "+JSON.stringify(result));
    console.log("TasksID: "+JSON.stringify(result.rows[0].idzadatak));
    console.log("Testcases: "+JSON.stringify(testcases));
    for (const testcase of testcases) {
        //Body ima vrstaTestCase,imeTestCase,imeFunkcije,input,output
        console.log("Spremanje u bazu testcase: "+testcase.imeTestCase);
        //let testCaseJSON=JSON.stringify({funcName: testcase.JSON.imeFunkcije, input: testcase.JSON.input, output: testcase.JSON.output})
        await db.query(`INSERT INTO testcase (imeTestCase,JSON,vrstaTestCase,idZadatak)
                            VALUES ('${testcase.imeTestCase}','${JSON.stringify(testcase.JSON)}','${testcase.vrstaTestCase}',${result.rows[0].idzadatak})`).catch(
                                err=>{
                                    console.log(err)
                                    res.sendStatus(500)
                                }
        );
    }
    res.json({ok:true})
});

module.exports = router

