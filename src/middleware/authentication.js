const jwt = require('jsonwebtoken')
const User = require('../models/users')

//Middleware     request -> middleware -> run route handler
const authentication = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const isValidDecode = jwt.verify(token, process.env.JWT_TOKEN)

        const user = await User.findOne({_id: isValidDecode._id, 'tokens.token': token})
       
        if(!user){
            throw new Error()
        }
        
        req.user = user
        req.token = token
        next()
    }
    catch (err){
        res.status(401).send({error: 'Please authenticate'})
    }
    
}

module.exports = authentication