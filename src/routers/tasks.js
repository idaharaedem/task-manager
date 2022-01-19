const express = require('express')
const router = new express.Router()
const Task = require('../models/tasks')
const authentication =  require('../middleware/authentication')

router.get('/tasks', authentication, async (req, res) => {

    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 
        console.log(sort[parts[0]])
    }

    try{
        //const tasks = await Task.find({owner: req.user._id})
        
        
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
            }

        })

        res.status(200).send(req.user.tasks)  
    }
    catch(err) {
        res.status(400).send(err)  
    }

    // Task.find({}).then((user)=> {
    //     res.status(200).send(user)
    // }).catch((err)=> {
    //     res.status(404).send(err)
    // })

    //localhost:3000/tasks/61e026ee34b6498260579463
})

router.get('/tasks/:id', authentication ,async (req, res) => {
    const _id = req.params.id

    

    try {
        //const task = await Task.findById(_id)

        const task = await Task.findOne({_id: _id, owner: req.user._id})

        if(!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    }
    catch(err) {
        res.status(404).send(err)
    }
    // Task.findById(_id).then((user)=> {
    //     if(!user){
    //        return res.status(404).send()
    //     }

    //     res.send(user)

    // }).catch((err) => {
    //     res.status(500).send(err)
    // })
})

router.put('/tasks/:id', authentication,async (req, res)=> {

    const values = ['description', 'completed']
    //convert to an array of properties
    const update = Object.keys(req.body)
    const isValidUpdate = update.every((up) => {
        return values.includes(up)
    })

    if(!isValidUpdate) {
        return res.status(400).send({error: 'Invalid Updates!'})
    }

    try
    {
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        update.forEach((up) => {
            task[up] = req.body[up]
        })

        await task.save()

        if(!task) {
            return res.status(400).send()
        }

        res.status(200).send(task)
    }
    catch(err)
    {
        res.status(400).send(err)
    }
})

router.post('/tasks', authentication ,async(req, res) => {
    //const task =  new Task(req.body)

    const task = new Task({
        //spreading all the request body and adding the owner
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(200).send(task)
    }
    catch(err) {
        res.status(400).send(err)
    }

 
})


router.delete('/tasks/:id', authentication, async (req, res) => {
    
    try {
     const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task) {
            res.status(400).send()
        }

        res.status(200).send(task)
    }
    catch(err) {
        res.status(500).send()
    }
})

module.exports = router
