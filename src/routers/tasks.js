const express = require('express')
const router = new express.Router()
const Task = require('../models/tasks')

router.get('/tasks', async (req, res) => {

    try{
        const tasks = await Task.find({})
        res.status(200).send(tasks)  
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

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)

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

router.put('/tasks/:id', async (req, res)=> {

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

        const task = await Task.findById(req.params.id)

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

router.post('/tasks', async(req, res) => {
    const task =  new Task(req.body)

    try {
        await task.save()
        res.status(200).send(task)
    }
    catch(err) {
        res.status(400).send(err)
    }

 
})


router.delete('/tasks/:id', async (req, res) => {
    
    try {
     const task = await Task.findByIdAndDelete(req.params.id)
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
