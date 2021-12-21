const {Pool} = require('pg');
//Local database

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'projektR',
    password: "bazepodataka",
    port: 5432,
});


// Remote database
/*
 const pool = new Pool({
     user: 'projektadmin',
     host: '161.53.18.24',
     database: 'WebTest',
     password: "5tz89rg5489ohizg",
     port: 5432,
 });
 */

async function getTestcase(idzadatka){
    let res= await pool.query('SELECT * FROM testcase WHERE idzadatak=$1',[idzadatka]).then(
        value => {return value.rows}
    ).catch(err=>{console.log(err)})

    return res
}

async function getTask(taskID){
    let res = await pool.query('SELECT * FROM zadatak WHERE idzadatak=$1',[taskID]).then(
        value => {return value.rows[0]}
    ).catch(err=>{console.log(err)})
    return res
}

async function getLastSolution(idzadatak, jmbag){
    let res=await pool.query('SELECT * FROM riješenizadatak WHERE idzadatak=$1 AND jmbag=$2 ORDER BY uploaddate DESC LIMIT 1',[idzadatak, jmbag]).then(
        value=>{return value.rows[0]}
    ).catch(err=>console.log(err))

    return res
}

async function getSolution(solvedTaskID){
    let res=await pool.query('SELECT * FROM riješenizadatak WHERE idriješenizadatak=$1',[solvedTaskID]).then(
        value=>{return value.rows[0]}
    ).catch(err=>console.log(err))

    return res
}

async function insertSolution(file,uploaddate,jmbag,taskID){
    let res=await pool.query('INSERT INTO riješenizadatak (file,uploaddate,jmbag,idzadatak) VALUES ($1,$2,$3,$4) RETURNING idriješenizadatak',
        [file,uploaddate,jmbag,taskID]).then(
            value=>{return value.rows[0].idriješenizadatak}
    ).catch(
            err=>{console.log(err)}
    )
    return res
}

async function insertResult(idTestcase, idRijeseniZadatak, testResult){
    await pool.query('INSERT INTO rezultat (idtestcase, idriješenizadatak, prolaz) VALUES ($1,$2,$3)',
        [idTestcase,idRijeseniZadatak,testResult]).catch(
        err=>{console.log("INSERT RESULTS\n"+err)}
    )
}

async function getActiveTasks(){
    let res=await pool.query('SELECT * FROM zadatak WHERE active=true').then(
        value => {return value.rows}
    ).catch(err =>{"GET ACTIVE TASKS\n"+console.log(err)})
    return res
}

async function getSolutionResults(solvedTaskID){
    let res=await pool.query('SELECT * FROM rezultat WHERE idriješenizadatak=$1',[solvedTaskID]).then(
        value => {return value.rows}
    ).catch(err =>{console.log("GET SOLUTION RESULTS\n"+err)})
    return res
}
module.exports = {
    query: (text, params) => {
        const start = Date.now();
        return pool.query(text, params)
            .then(res => {
                const duration = Date.now() - start;
                console.log('executed query', {text, params, duration, rows: res.rows});
                return res;
            });
    },
    pool: pool,
    getTestcase,
    insertResult,
    getLastSolution,
    insertSolution,
    getTask,
    getActiveTasks,
    getSolutionResults,
    getSolution
}
