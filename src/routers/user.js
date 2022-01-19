const express = require('express')
const router = new express.Router()
const User = require('../models/users')
const authentication = require('../middleware/authentication')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, cancelEmail} = require('../emails/account')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        
     await user.save()
     sendWelcomeEmail(user.email, user.name)
     const token = await user.generateAuthToken()
     res.status(200).send({user, token})
    }
    catch (err) {
     res.status(400).send(err)
    }
 })

 router.post('/users/login', async(req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()
        res.send({user, token})
    }
    catch(err) {
        res.status(400).send(err)
    }
 })
 
 router.get('/users/me', authentication ,async (req, res) => {
    res.send(req.user) 
    
    
    //empty body means looking for everything
    //  try{
    //      const users = await User.find({})
    //      res.status(200).send(users)
    //  }
    //  catch(err) {
    //      res.status(400).send()
    //  }
     // User.find({}).then((users)=> {
     //     res.status(200).send(users)
     // }).catch((err) =>{
     //     res.status(500).send(err)
     // })
 })

 router.post('/users/logout', authentication, async(req, res) => {
    try
    {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token === req.token
        })

        await req.user.save()
        res.send()
    }
    catch(err) {
        res.status(500).send(err)
    }
 })

 router.post('/users/logoutall', authentication, async (req, res)=> {
     try{
        req.user.tokens = []

        await req.user.save()
        res.send()
     }
     catch(err) {
        res.status(500).send(err)
     }
 })
 
 //Get user by Id.--- Dont need it anymore 
//  router.get('/users/:id', async (req, res) => {
//      const _id = req.params.id
 
//      try{    
//        const user = await User.findById(_id)
//        if(!user) {
//            return res.status(404).send()
//        }
//        res.status(200).send(user)  
//      }
//      catch(err) {
//          res.status(400).send()
//      }
     // User.findById(_id).then((user)=> {
     //     if(!user) {
     //         return res.status(404).send()
     //     }
 
     //     res.status(200).send(user)
       
     // }).catch((err) => {
     //     res.status(500).send(err)
     // })
//  })
 
 router.put('/users/me', authentication, async (req, res)=> {
     const update = Object.keys(req.body)
     const allowed = ['name', 'email', 'password', 'age']
     const isValidUpdate = update.every((up)=> {
         return allowed.includes(up)
     })
     
 if(!isValidUpdate) {
     return res.status(400).send({error: 'Invalid Updates!'})
 }
 
     try {
         
         //This updadate bypasses our middleware so we need to do a few altications
         //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true})

         update.forEach((up) => {
             req.user[up] = req.body[up]
         })

         await req.user.save()
 
         res.status(200).send(req.user)
 
     }
     catch(err) {
         res.status(400).send(err)
     }
 })
 
 
 router.delete('/users/me', authentication ,async (req, res) => {
     try {
        // const user =  await User.findByIdAndDelete(req.user._id)
 
        // if(!user) {
        //     return res.status(400).send(res)
        // }
        
        await req.user.remove()
        cancelEmail(req.user.email, req.user.name)

        res.status(200).send(req.user)
     }
     catch(err) {
         console.log(err)
         res.status(500).send(err)
     }
 })

 const upload = multer({
     limits: {
         fileSize: 2000000
     },
     fileFilter(req, file, callback) {
        
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return callback(new Error('please upload relevant an image'))
        }

        callback(undefined, true)
        //callback(undefined, true)
     }
 })


 router.post('/users/me/avatar', authentication ,upload.single('upload') , async (req, res)=> {
     
     const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer


     await req.user.save()
     res.send()
 }, (error, req, res, next) => {
     res.status(400).send({error: error.message})
 })

 router.delete('/users/me/avatar', authentication, async (req, res) => {
    req.user.avatar = undefined 
    
    await req.user.save()

    res.send()
 })

 router.get('/users/:id/avatar', async(req, res) => {
     try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
     }
     catch(err) {
         res.status(404).send(err)
     }
 })

module.exports = router

