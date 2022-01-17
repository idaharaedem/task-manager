const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//creating schema for middleware instead of passing into mongoose.model directly
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim:true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is not valid')
            }
        }
    }, 
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        validate(value) {
            if(value == "password") {
                throw new Error('Cannot use this password')
            }
        } 
    },

    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
 })

 //.statics allows you to add on the model before it eventually comes down to hashing
 userSchema.statics.findByCredentials = async(email, password) => {
     const user = await User.findOne({email: email})
    
     if(!user) {
         throw new Error('Unable to log in')
     }

     const isMatch = await bcrypt.compare(password, user.password)

     if (!isMatch) {
         throw new Error('Unable to login')
     }

     return user
 }

 userSchema.methods.toJSON = function() {
     const user = this
     const userObject = user.toObject()

     delete userObject.password
     delete userObject.tokens

     return userObject
 }

 userSchema.methods.generateAuthToken = async function() {
     const user = this
     const token = jwt.sign({_id: user._id.toString() }, 'nodecoursecontent')

     user.tokens = user.tokens.concat({token: token})
     await user.save()
     return token
 }

 //Hshing password before saving completelyS
userSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

 module.exports = User

//  const me = new User({
//      name: 'Dani',
//      age: 30,
//      email:'D@gmail.com',
//      password: 'passwords'
//  })

//  me.save().then(()=> {
//     console.log(me)
//  }).catch((err) => {
//      console.log(err)
//  })