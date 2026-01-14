const express = require("express");

const { connectToDb, getDb } = require("./db");


const app = express();

app.use(express.json());

let db;

connectToDb((err) => {
    if (!err) {
        app.listen(3001, () => {
            console.log("Server is running on port 3001");
        });
        db = getDb();
    }

});

app.get('/api/students', (req, res) => {
    const page = req.query.p || 0;
    const studentsPerPage = 10;
    let students = [];
    db.collection('students')
        .find()
        .sort({ id: 1 })
        .skip(page * studentsPerPage)
        .limit(studentsPerPage)
        .forEach((student) => students.push(student))
        .then(() => {
            res.status(200).json(students)
        })
        .catch(() => {
            res.status(500).json({ msg: 'Error getting the users' });
        })
})

app.get('/api/students/:id', (req, res) => {
    const studentID = parseInt(req.params.id);
    if (!isNaN(studentID)){
        db.collection('students')
        .findOne({id: studentID})
        .then((student) => {
            if (student) {
                res.status(200).json(student);
            } else {
                res.status(404).json({ msg: 'Student not found' });
            }
        })
        .catch(() => {
            res.status(500).json({msg: 'Error getting student info'});
        })
    } else {
        res.status(400).json({Error: 'Err: Student ID must be a number'});
    }
})

app.post('/api/students', (req,res) => {
    const student = req.body;
    db.collection('students')
    .insertOne(student)
    .then((result) => {
        res.status(201).json({ result});
    })
    .catch(() =>{
        res.status(500).json({msg: 'Error creating student'});
    })
})

app.patch('/api/students/:id', (req, res) => {
    let updates = req.body;
    const studentID = parseInt(req.params.id);
    if(!isNaN(studentID))  {
        db.collection('students')
            .updateOne(
                {id: studentID},
                {$set: updates}
            )
            .then((result) => {
                res.status(200).json({result});
            }) 
            .catch (() => {
                res.status(500).json({msg: 'Error updating student'});
            })
    } else {
        res.status(400).json({Error: 'Err: Student ID must be a number'});
    
    }
})

app.delete('/api/students/:id', (req, res) => {
    const studentID = parseInt(req.params.id);
    if(!isNaN(studentID)){
        db.collection('students')
        .deleteOne({id: studentID})
        .then((result) => {
            res.status(200).json({result});
        })
        .catch(() => {
            res.status(500).json({msg: 'Error deleting student'});
        })
    } else {
        res.status(400).json({Error: 'Err: Student ID must be a number'});
    }
    
})
