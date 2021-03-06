const {Pool} = require('pg');
//Local database

/*
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'projektR',
    password: "bazepodataka",
    port: 5432,
});
*/


// Remote database
 const pool = new Pool({
     user: 'projektadmin',
     host: '161.53.18.24',
     database: 'WebTest',
     password: "5tz89rg5489ohizg",
     port: 5432,
 });


async function getTestcase(idzadatka) {
    let res = await pool.query('SELECT * FROM testcase WHERE idzadatak=$1', [idzadatka]).then(
        value => {
            return value.rows
        }
    ).catch(err => {
        console.log(err)
    })

    return res
}

async function getTestcaseById(idtestcase) {
    let res = await pool.query('SELECT * FROM testcase WHERE idtestcase=$1', [idtestcase]).then(
        value => {
            return value.rows[0]
        }
    ).catch(err => {
        console.log(err)
    })

    return res
}

async function getTask(taskID) {
    let res = await pool.query('SELECT * FROM zadatak WHERE idzadatak=$1', [taskID]).then(
        value => {
            return value.rows[0]
        }
    ).catch(err => {
        console.log(err)
    })
    return res
}

async function getLastSolution(idzadatak, jmbag) {
    let res = await pool.query('SELECT * FROM riješenizadatak WHERE idzadatak=$1 AND jmbag=$2 ORDER BY uploaddate DESC LIMIT 1', [idzadatak, jmbag]).then(
        value => {
            return value.rows[0]
        }
    ).catch(err => console.log(err))

    return res
}

async function getSolution(solvedTaskID) {
    let res = await pool.query('SELECT * FROM riješenizadatak WHERE idriješenizadatak=$1', [solvedTaskID]).then(
        value => {
            return value.rows[0]
        }
    ).catch(err => console.log(err))

    return res
}

async function getAllSolutions(taskID) {
    let res = await pool.query('SELECT * FROM riješenizadatak WHERE idzadatak=$1', [taskID]).then(
        value => {
            return value.rows
        }
    ).catch(err => console.log(err))

    return res
}

async function insertSolution(file, uploaddate, jmbag, taskID, filename) {
    let res = await pool.query('INSERT INTO riješenizadatak (file,uploaddate,jmbag,idzadatak,filename) VALUES ($1,$2,$3,$4,$5) RETURNING idriješenizadatak',
        [file, uploaddate, jmbag, taskID, filename]).then(
        value => {
            return value.rows[0].idriješenizadatak
        }
    ).catch(
        err => {
            console.log(err)
        }
    )
    return res
}

async function insertResult(idTestcase, idRijeseniZadatak, testResult) {
    await pool.query('INSERT INTO rezultat (idtestcase, idriješenizadatak, prolaz) VALUES ($1,$2,$3)',
        [idTestcase, idRijeseniZadatak, testResult]).catch(
        err => {
            console.log("INSERT RESULTS\n" + err)
        }
    )
}

async function getActiveTasks() {
    let res = await pool.query('SELECT * FROM zadatak WHERE active=true').then(
        value => {
            return value.rows
        }
    ).catch(err => {
        console.log("GET ACTIVE TASKS\n" + err)
    })
    return res
}

async function getInactiveTasks() {
    let res = await pool.query('SELECT * FROM zadatak WHERE active=false').then(
        value => {
            return value.rows
        }
    ).catch(err => {
        console.log("GET INACTIVE TASKS\n" + err)
    })
    return res
}

async function getSolutionResults(solvedTaskID) {
    let res = await pool.query('SELECT * FROM rezultat WHERE idriješenizadatak=$1', [solvedTaskID]).then(
        value => {
            return value.rows
        }
    ).catch(err => {
        console.log("GET SOLUTION RESULTS\n" + err)
    })
    return res
}

async function insertTask(imeZadatak, opisZadatak, professorID, vrstaZadatak, active, date) {
    let res = await pool.query('INSERT INTO zadatak (imeZadatak,opisZadatak,idProfesor,idVrsta,active,datum) VALUES($1,$2,$3,$4,$5,$6) RETURNING idzadatak',
        [imeZadatak, opisZadatak, professorID, vrstaZadatak, active, date])
        .then(value => {
            return value.rows[0].idzadatak
        })
        .catch(err => {
            console.log("Insert Task error\n" + err)
        })
    return res
}

async function insertTestcase(imeTestCase, JSON, vrstaTestCase, taskID) {
    let res = await pool.query('INSERT INTO testcase (imeTestCase,JSON,vrstaTestCase,idZadatak) VALUES($1,$2,$3,$4) RETURNING idtestcase',
        [imeTestCase, JSON, vrstaTestCase, taskID])
        .then(value => {
            return value.rows[0].idtestcase
        })
        .catch(err => {
            console.log('INSERT TESTCASE ERROR\n' + err)
        })
    return res
}

async function getAllProfessors() {
    let res = await pool.query('SELECT * FROM profesor', []).then(
        value => {
            return value.rows
        }
    ).catch(err => console.log(err))
    return res
}

async function getStudent(jmbag){
    let res = await pool.query('SELECT * FROM student WHERE jmbag=$1', [jmbag]).then(
        value => {
            return value.rows[0]
        }
    ).catch(err => console.log(err))
    return res
}

async function getProfessor(id){
    let res = await pool.query('SELECT * FROM profesor WHERE idprofesor=$1', [id]).then(
        value => {
            return value.rows[0]
        }
    ).catch(err => console.log(err))
    return res
}

async function getUserByEmail(email){
    let user=await pool.query('SELECT * FROM "user" WHERE email=$1 LIMIT 1',[email]).then(
        value => {
            return value.rows[0]
        }).catch(err=>{console.log("Get user by email error\n"+err)})
    return user
}

async function deactivateTask(taskID) {
    let res = await pool.query('UPDATE zadatak SET active=false WHERE idzadatak=$1;', [taskID]).then(
        value => {
            return value.rows[0]
        }
    ).catch(err => {
        console.log(err)
    })
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
    getInactiveTasks,
    getSolutionResults,
    getSolution,
    getAllProfessors,
    insertTask,
    insertTestcase,
    getAllSolutions,
    getStudent,
    getProfessor,
    getUserByEmail,
    deactivateTask,
    getTestcaseById
}
