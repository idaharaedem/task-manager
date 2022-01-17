const mongoose = require('mongoose')
const validator = require('validator')

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        minLength: 2,
        trim: true

    },
    completed: {
        type: String,
        default: false
    }
}) 

module.exports = Task