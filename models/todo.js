const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    }
    
})

const Todo = module.exports = mongoose.model('task', todoSchema)