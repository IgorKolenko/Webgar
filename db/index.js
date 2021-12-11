const {Pool} = require('pg');
//Local database
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'projektR',
    password: "ferbp",
    port: 5432,
});

// Remote database
// const pool = new Pool({
//     user: 'projektadmin',
//     host: '161.53.18.24',
//     database: 'WebTest',
//     password: "5tz89rg5489ohizg",
//     port: 5432,
// });

async function getTestcase(idzadatka){
    let res= await pool.query('SELECT * FROM testcase WHERE idzadatak=$1',[idzadatka]).then(
        value => {return value.rows}
    ).catch(err=>{console.log(err)})

    return res
}

async function getSolution(idRijesenZadatak){
    let res=await pool.query('SELECT * FROM riješenizadatak WHERE idriješenizadatak=$1',[idRijesenZadatak]).then(
        value=>{return value.rows[0]}
    ).catch(err=>console.log(err))

    return res
}

async function insertResult(testResult, idTestcase, idRijeseniZadatak){
    await pool.query('INSERT INTO rezultat (prolaz, idtestcase, idriješenizadatak) VALUES ($1,$2,$3)',
        [testResult, idTestcase,idRijeseniZadatak,]).catch(
        err=>{console.log(err)}
    )
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
    getSolution,
    insertResult
}
