require('../src/db/mongoose')
const User = require('../src/models/users')

// User.findByIdAndUpdate('61dfe6210cadedf30f49e605', {age: 12}).then((user)=> {
//     console.log(user)
//     return User.countDocuments({age: 30})
// }).then((result)=> {
//     console.log(result)
// }).catch((err)=> {
//     console.log(err)
// })

const updateAge = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age: age})
    const count = await User.countDocuments({age: age}) 
    return count
}

updateAge('61dfe6210cadedf30f49e605', 30).then((count) => {
    console.log(count)
})