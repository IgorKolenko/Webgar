var express = require('express');
var router = express.Router();
const db = require('../db');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

router.get('/activeTasks', async function (req,res,next){
    let activeTasks=await db.getActiveTasks();
    res.send(activeTasks);
});

router.get('/:taskID', async function (req,res,next){
    let task=await db.getTask(req.params.taskID);
    res.send(task);
});


router.post('/newSolution',async function(req,res,next){
    //TODO HARDCODED VARIABLES
    let file=req.body.file;
    let jmbag="0036123456"; // ubuduce req.body.jmbag ?
    let taskID=1; // ubuduce req.body.taskID?
    let uploaddate=new Date();


    let solvedTaskID=await db.insertSolution(file,uploaddate,jmbag,taskID).catch(err=>{
        console.log(err)
        res.sendStatus(500)
    });

    let task=await db.getTask(taskID)
    let taskType=task.idvrsta
    // console.log("TASKTYPE "+taskType)
    var hostUrl =req.protocol + '://' + req.get('host');

    let params={
        jmbag: jmbag,
        taskID: taskID,
        solvedTaskID: solvedTaskID
    }
    //HTML
    if(taskType==1){
        await fetch(hostUrl+'/html/htmlTesting',{
            method: 'POST',
            body: JSON.stringify(params),
            headers: { 'Content-Type': 'application/json' }
        })
    }
    //CSS
    else if (taskType==2){
        await fetch(hostUrl+'/css/cssTesting',{
            method: 'POST',
            body: JSON.stringify(params),
            headers: { 'Content-Type': 'application/json' }
        })
    }
    //JS
    else if(taskType==3){
        await fetch(hostUrl+'/js/jsTesting',{
            method: 'POST',
            body: JSON.stringify(params),
            headers: { 'Content-Type': 'application/json' }
        })
    }
    // console.log(solvedTaskID)
    let testcaseResults=await db.getSolutionResults(solvedTaskID)
    // res.sendStatus(200)
    res.send(testcaseResults)
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

