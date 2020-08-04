const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost:27017/todo')
const db = mongoose.connection;

//check connection
db.once('open', function(){
    console.log('Connected to MongoDB')
})

//check db
db.on('error', function(err){
    console.log(err)
})

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//set public folder
app.use(express.static(path.join(__dirname, 'public')))

//Model

const Todo = require('./models/todo')

app.set('view engine', 'pug')

app.get('/', (req, res) => {
    Todo.find({}, function(err, todo){
        if(err) {
            console.log(err)
        }else {
            res.render('index', {
                title: 'todo',
                todo: todo
            })
        }
    }) 
})

//Get single todo
app.get('/todo/:id', function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        res.render('todo', {
            todo: todo
        })
    }) 
})


app.get('/user/add', function(req, res) {
    res.render('add', {
        title: 'Add TODO'
    })
})

//submit
app.post('/user/add', function(req, res){
    const todo = new Todo()
    todo.Name = req.body.Name
    todo.Description = req.body.Description

    todo.save(function(err){
        if(err) {
            console.log(err)
            return
        }else {
            res.redirect('/')
        }
    })
})

//update
app.post('/user/edit/:id', function(req, res){
    const todo = {}
    todo.Name = req.body.Name
    todo.Description = req.body.Description

    const query = {_id:req.params.id}

    Todo.update(query, todo, function(err){
        if(err) {
            console.log(err)
            return
        }else {
            res.redirect('/')
        }
    })
})

//Load Edit form todo
app.get('/todo/edit/:id', function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        res.render('edit_todo', {
            title: 'Edit TODO',
            todo: todo
        })
    }) 
})


app.listen(4000, () => {
    console.log("listening on port 3000")
})