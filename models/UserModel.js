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

    verifyPassword(password){
        return this.password ? this.password == password : false
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