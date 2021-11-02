var express = require('express');
var router = express.Router();
const db = require('../db');

// Post - Save testcase into local list
const localTestcases = []
router.post('/addTestcase',async function (req,res){
    //Recieves JSON data
    //Body ima vrstaTestCase,imeTestCase,imeFunkcije,input,output
    localTestcases.push(req.body)
    res.send({ok:true})
});

// Post spremi zadatak i testcaseove u bazu
router.post('/addTask',async function (req,res){
    //Body: imeZadatak,vrstaZadatak,opisZadatak
    const{imeZadatak,opisZadatak,vrstaZadatak}=req.body

    // Insert Task into database
    taskID=await db.query(`INSERT INTO Zadatak (imeZadatak,opisZadatak,idProfesor,idVrsta)
                                VALUES('${imeZadatak}','${opisZadatak}',1,${vrstaZadatak}) RETURNING idZadatak`)

    // Insert testcase into database
    localTestcases.forEach(testcase=>async function (){
        // console.log(JSON.parse(testcase))
        //Body ima vrstaTestCase,imeTestCase,imeFunkcije,input,output
        testCaseJSON=JSON.stringify({funcName: testcase.imeFunkcije, input: testcase.input, output: testcase.output})
        await db.query(`INSERT INTO TestCase (imeTestCase,JSON,vrstaTestCase,idZadatak)
                            VALUES ('${testcase.imeTestCase}','${testCaseJSON}','${testcase.vrstaTestCase}',${taskID})`);
    })
    localTestcases.length=0

    res.send({ok:true})
});

// Get testcases
router.get('/getLocalTestcase',async function (req,res){
    // Get testCases from database
    // let testCases = await db.query("SELECT * FROM TestCase WHERE idZadatak=" + req.params.task).then(value=>{
    //     return value.rows;
    // })
    // console.log(req.params)
    res.send(localTestcases)
});

module.exports = router

