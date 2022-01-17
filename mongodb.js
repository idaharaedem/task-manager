const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectId

const {MongoClient, ObjectID} = require('mongodb') 

// const id = new ObjectID()
// console.log(id)
// console.log(id.getTimestamp())

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error) {
       return console.log('Unable to connect to database')
    }

    const db = client.db(databaseName)

    //Create

    // db.collection('users').insertOne({
    //     name: 'Joyner',
    //     age: 88
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert a user')
    //     }
    //     console.log(result.ops)
    // }) 

    //Read

    // db.collection('users').findOne({_id: new mongodb.ObjectId("61ded236ee5a871a1680569f")}, (error, user)=>{
    //     if(error) {
    //        return console.log('Unable to find a user') 
    //     }

    //     console.log(user)
    // } )

    // returns a cursor not a function

    // db.collection('tasks').find({completed: false}).toArray((error, users) => {
    //     console.log(users)
    // })

    //Update
    //  db.collection('tasks').updateOne({
    //     _id: new mongodb.ObjectId("61ded3abb5b053848ab6b7ee")
    // }, {
    //     $set: {
    //         completed: false
    //     }
    // }).then((result)=> {
    //     console.log(result)
    // }).catch((err)=> {
    //     console.log(err)
    // })

    //delete
    db.collection('tasks').deleteOne({
        _id: new mongodb.ObjectId("61ded3abb5b053848ab6b7ee")
    }).then(()=> {
        console.log('deleted')
    }).catch(()=> {
        console.log('error')
    })
})
