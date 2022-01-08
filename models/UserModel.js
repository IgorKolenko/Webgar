const db= require('../db')

module.exports=class User{
    constructor(email,password,role,profID,jmbag,firstName,lastName) {
        this.email = email
        this.password = password
        this.role = role
        this.profID=profID
        this.jmbag=jmbag
        this.firstName=firstName
        this.lastName=lastName
    }

    async saveUser(){
        await db.pool.query('INSERT INTO "user"  (email,password,role,idprofesor,jmbag) VALUES ($1,$2,$3,$4,$5)',
            [this.email,this.password,this.role,this.profID,this.jmbag])
            .catch(err=>{
                console.log("Insert User error\n"+err)
            });
    }

    async insertStudent(){
        await db.pool.query('INSERT INTO student (jmbag, imestudent, prezimestudent) VALUES($1,$2,$3)',
            [this.jmbag,this.firstName,this.lastName])
            .catch(err=>{
                console.log("Insert student error\n"+err);
            })
    }

    async saveStudent(){
        await this.insertStudent()
        await this.saveUser()
    }

    static async getByEmail(email){
        // let result=await db.pool.query('SELECT * FROM "user"')
        // console.log(result)
        let result= await db.getUserByEmail(email)
        if(result!==undefined){
            let firstName,lastName
            if (result.role==='profesor'){
                let profesor=await db.getProfessor(result.idprofesor)
                firstName=profesor.imeprofesor
                lastName=profesor.prezimeprofesor
            }else if(result.role==='student'){
                let student=await db.getStudent(result.jmbag)
                firstName=student.imestudent
                lastName=student.prezimestudent
            }
            let user=new User(result.email,result.password,result.role,result.idprofesor,result.jmbag
                ,firstName,lastName)
            return user
        }
    }
}