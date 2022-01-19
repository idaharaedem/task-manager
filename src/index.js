const express = require('express')
//connecting to the database through mongoose file
require('./db/mongoose')
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/tasks')
const e = require('express')

const port = process.env.PORT || 3000
const app = express()


//parse the data to Json
app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)


app.listen(port, () => {
    console.log('listening on port ' + port)
})

// const jwt = require('jsonwebtoken')

// const myFunc = async() => {

//     const token = jwt.sign({_id: 'ab4785'},'newThing')

//     const verify = jwt.verify(token, 'newThing')
//     console.log(token)
// }

// myFunc()

const multer = require('multer')
const upload = multer({
    dest: 'images'
})

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
})
