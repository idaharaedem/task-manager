const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        minLength: 2,
        trim: true

    },
    completed: {
        type: String,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //reference from this field to another model
        ref:'User'
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', userSchema)

module.exports = Task