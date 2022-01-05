var express = require('express');
var router = express.Router();
const db = require('../db');
const cssTest = require('./cssTesting');
const jsTester=require('./jsTesting')
const htmlTester = require('./htmlTesting')
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

//Vraca neaktivne zadatke
router.get('/activeTasks', async function (req,res,next){
    let activeTasks=await db.getActiveTasks();
    res.send(activeTasks);
});

//Vraca stare zadatke
router.get('/inactiveTasks',async function(req,res,next){
    let inactiveTasks=await db.getInactiveTasks();
    res.send(inactiveTasks)
})

//Deaktivira zadatak
router.get('/deactivateTask/:taskID',async function (req,res,next){
    let task=await db.deactivateTask(req.params.taskID);
    res.send(task);
});

//Vraca rjesenja za zadatak sa imenima studenata
router.get('/solutions/task/:taskID', async function(req,res,next){
    let studentSolution=await db.getAllSolutions(req.params.taskID)
    //Add student name and surname to task
    for(let i=0;i<studentSolution.length;i++){
        let student=await db.getStudent(studentSolution[i].jmbag);
        studentSolution[i].name=student.imestudent;
        studentSolution[i].surname=student.prezimestudent
    }
    res.send(studentSolution)
})

// Vraca rjesenje zadatka s imenom studenta i rezultatima
router.get('/solutions/:solvedTaskID/',async function (req,res,next){
    let solution=await db.getSolution(req.params.solvedTaskID)
    //Dodaj studenta
    let student=await db.getStudent(solution.jmbag);
    solution.name=student.imestudent;
    solution.surname=student.prezimestudent
    //Dodaj rezultate
    let results=await db.getSolutionResults(req.params.solvedTaskID)
    let send={
        "solution":solution,
        "results":results
    }
    res.send(send)
})

//Vraca sve profesore iz baze
router.get('/professors', async function (req,res,next){
    let professors=await db.getAllProfessors();
    res.send(professors);
});

//Vraca zadatak iz baze
router.get('/:taskID', async function (req,res,next){
    let task=await db.getTask(req.params.taskID);
    res.send(task);
});

//Dodaje se rijesenja zadatka u bazu, testira i vracaju rezultati
router.post('/newSolution',async function(req,res,next){
    //TODO HARDCODED VARIABLES
    let file=req.body.fileData;
    let jmbag="0036123456"; // ubuduce req.body.jmbag ?
    let taskID=req.body.zadatakId; // ubuduce req.body.taskID?
    let uploaddate=new Date();


    let solvedTaskID=await db.insertSolution(file,uploaddate,jmbag,taskID).catch(err=>{
        console.log(err)
        res.sendStatus(500)
    });

    let task=await db.getTask(taskID)
    let taskType=task.idvrsta
    // console.log("TASKTYPE "+taskType)
    var hostUrl =req.protocol + '://' + req.get('host');
    console.log("HostUrl: "+hostUrl);

    let params={
        jmbag: jmbag,
        taskID: taskID,
        solvedTaskID: solvedTaskID
    }
    //HTML
    if(taskType==1){
        await htmlTester.testHTML(taskID,jmbag,solvedTaskID)
    }
    //CSS
    else if (taskType==2){
        console.log("Testiranje css zadatka");
        let res = await cssTest(jmbag, taskID, solvedTaskID);
       console.log(res);
    }
    //JS
    else if(taskType==3){
        await jsTester.testJS(taskID,jmbag,solvedTaskID)
    }
    // console.log(solvedTaskID)
    let testcaseResults=await db.getSolutionResults(solvedTaskID)
    let testcases = await db.getTestcase(taskID)
    let send = {
        "results": testcaseResults,
        "testcases": testcases
    }
    // res.sendStatus(200)
    res.send(send);
});


// Post spremi zadatak i testcaseove u bazu
router.post('/addTask',async function (req,res,next){
    console.log("Dodavanje u bazu");
    //Body: imeZadatak,vrstaZadatak,opisZadatak
    const{imeZadatak,opisZadatak,vrstaZadatak, testcases}=req.body

    // Insert Task into database
    //TODO Currently Hardcoded profesorID
    let professorID = 1;
    let taskID = await db.insertTask(imeZadatak,opisZadatak,professorID,vrstaZadatak,true,new Date())

    // Insert testcase into database
    // console.log("res: "+JSON.stringify(result));
    // console.log("TasksID: "+JSON.stringify(taskID));
    // console.log("Testcases: "+JSON.stringify(testcases));
    for (const testcase of testcases) {
        //Body ima vrstaTestCase,imeTestCase,imeFunkcije,input,output
        console.log("Spremanje u bazu testcase: "+testcase.imeTestCase);
        //let testCaseJSON=JSON.stringify({funcName: testcase.JSON.imeFunkcije, input: testcase.JSON.input, output: testcase.JSON.output})
        await db.insertTestcase(testcase.imeTestCase,JSON.stringify(testcase.JSON),testcase.vrstaTestCase,taskID)

    }
    res.json({ok:true})
});

module.exports = router

