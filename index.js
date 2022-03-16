import express, { json } from 'express'
import {
    v4 as uuidv4
} from "uuid"
const app = express()

app.listen(3000)

let usersDb = []

const checkingCpf = (req,res,next) =>{
    
    const { cpf } = req.params

    const userExists = usersDb.find((user) => user.cpf === cpf)

    if (!userExists) {
        res.statusCode = 404
        res.send({ error: "user is not registered" })
    }

    return next()
}


const checkingRepeatingCpf = (req,res,next) => {

    const { cpf } = req.body
    const userExists = usersDb.find((user) => user.cpf === cpf)


    if (userExists) {
        res.statusCode = 422
        res.send({error: "user already exists"})

    } else {

        return next()
    }
}


const doesNoteExists = (req, res, next) => {
    const { cpf, id } = req.params

    const user = usersDb.find((user) => user.cpf == cpf) 

    const note = user.notes.find((note) => note.id === id)

    if (!note) {
        res.statusCode = 404
        res.send({ error: "note is not registered" }) 
    } else {

        next()
    }
}

app.use(express.json())


app.post("/users", checkingRepeatingCpf, (req,res, next) => {

    
    
    const { name, cpf } = req.body
    
    if (typeof(name) === "string" && typeof(cpf) === "string" ) {
        
        const id = uuidv4()
        const user = { id,name, cpf, notes:[] }

        usersDb.push(user)

        res.statusCode = 201
        res.send(user)

    }

})


app.get("/users", (req, res, next) => {
    res.send(usersDb)
})

app.patch("/users/:cpf", checkingCpf,(req, res, next) => {


    const { cpf } = req.params
    const body = req.body
    const userExists = usersDb.filter((user)=> user.cpf == cpf)

    const bodyKeys = Object.keys(body)

    if (userExists.length !== 0) {
        const message = "User is updated"
        const user = userExists[0]
        

        for (let i = 0; i< bodyKeys.length; i++) {

            if (user[bodyKeys[i]] !== undefined ) {

                user[bodyKeys[i]] = String(body[bodyKeys[i]])
            }

        }
        const response = {message, user}

        const newDb = usersDb.filter((userDb) => userDb.cpf !== user.cpf )

        usersDb = [...newDb, user]


        res.statusCode = 200
        res.send(response)

        
    }
  
    next()

})


app.delete("/users/:cpf", (req, res, next) => {

    const { cpf } = req.params

    const userExists = usersDb.filter((user)=> user.cpf === cpf)
    
    if (userExists.length !==0){
        const newDb = usersDb.filter((user)=> user.cpf !== userExists[0].cpf)

        usersDb = [...newDb]

        console.log('console',usersDb)

        res.statusCode = 204
        res.send('')
    }

    if (userExists.length === 0 ){

        res.statusCode = 404
        res.send({message:"User Not found"})
    }
    
    
})





app.post("/users/:cpf/notes", (req, res, next) => {
    
    const { cpf } = req.params
    const body = req.body
    const user = usersDb.find((user) => user.cpf == cpf)
    
    if (user) {

        const note = body
        note.id = uuidv4()
        note.created_at =  new Date()
        user.notes = [...user.notes, note]

        const newDb = usersDb.filter((userInDb) => userInDb .cpf !== user.cpf)
        
        usersDb = [...newDb, user]

        res.statusCode = 201
        res.send({message:`${body.title} was added into ${user.name} notes`})

    }
    if (!user ){

        res.statusCode = 401
        res.send({message:"An user with this cpf doenst exist"})

    }
})


app.get("/users/:cpf/notes", (req, res, next) => {
    const { cpf } = req.params
    const user = usersDb.find((user) => user.cpf == cpf)

    if (!user) {

        res.statusCode = 401
        res.send({message:"An user with this cpf doenst exist"})

    }
    if (user.notes) {

        res.send(user.notes)

    } else {

        res.send([])

    }

   

})

app.patch("/users/:cpf/notes/:id", doesNoteExists, (req, res, next) => {
    
    const { cpf, id } = req.params
    const body = req.body 

    const bodyKeys = Object.keys(body)
    const user = usersDb.find((user) => user.cpf == cpf)


    if (!user) {
        res.statusCode = 401
        res.send({message:"User not found"})
    }


    const noteToUpdate = user.notes.find((note) => note.id == id)
    if (!noteToUpdate) {
        res.statusCode = 401
        res.send({message:"Note not found"})
    }

    for (let i = 0 ; i< bodyKeys.length; i++) {

        if (noteToUpdate[bodyKeys[i]]) {

            noteToUpdate[bodyKeys[i]] = body[bodyKeys[i]]  
        }
    }   
    noteToUpdate.updated_at = new Date()

    const newDb = usersDb.filter((userDb) => userDb.cpf !== cpf)
    const userNotes = user.notes.filter((note) => note.id !== id)
    if (userNotes.length === 0) {
        user.notes = [noteToUpdate]
        usersDb = [...newDb, user]
        res.send(noteToUpdate)

    }
    user.notes = [...userNotes, noteToUpdate]
    usersDb = [...newDb, user]

    res.send(noteToUpdate)
    

   
    

})


app.delete("/users/:cpf/notes/:id", doesNoteExists, (req, res, next) => {
    const { cpf,id } = req.params

    const user = usersDb.find((user) => user.cpf === cpf)

    const newNotes = user.notes.filter((note) => note.id !== id)

    user.notes = newNotes

    res.statusCode = 204
    res.send("")
})