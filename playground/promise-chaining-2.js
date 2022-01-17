require('../src/db/mongoose')
const Task = require('../src/models/tasks')

// Task.deleteOne({id: '61e049cf085877995d054e34'}).then(() => {
//     console.log('deleted successfully')
//     return Task.countDocuments({completed: false})
// }).then((result) => {
//     console.log(result)
// }).catch((err)=> {
//     console.log(err)
// })

const deletCount = async (id) => {
    await Task.deleteOne({id})
    return await Task.countDocuments({completed: false})
}

deletCount('61e026ee34b6498260579463').then((result) => {
    console.log(result)
})