//node mon==>it starts What is Nodemon used autorestart after change
//nodemon is a command - line interface(CLI) utility developed by @rem that wraps your Node app, watches the file system, and automatically restarts the process
//express is a framework of node js that express to the routing
//this express only used inside the same folder we cannot access it from other folder
//this property is called local dependancy

//global dependancy
//>install to the laptop
//not specific to the folder
//can be used for any application
//global package doesnot added in the package.json
//to install global packages it requires admin access

////local dependancy
//>install in specific folder
//used to the same folder
//local package added in the package.json
//requires to run the app

//window==>
//open cmd as administrator
//npm i-g packagename
//to run nodemon foldername
//and change start test to start : filename.js
//and change test to dev: nodemon filename;==>change in req folder
//to run dev==>npm run dev
//start and dev are commands required to run the global package.
let express = require('express');
let app = express(); //object
let dotenv = require('dotenv')
let bodyParser = require('body-parser') //middleware==>supporting library=>keeps some functionality not native
let cors = require('cors') //Cross Origin Resourse Sharing//to allow react and node with diff port nos//to use api outside
dotenv.config();
let port = process.env.PORT || 9870; //to run the code in heroku as well as other env's we should need to give process.env.port
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
//let mongoUrl = process.env.MongoUrl; //localurl
let mongoUrl = process.env.MongoLiveUrl; //live url
let db;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors());

//one url for all routes
app.get('/items/:collections', (req, res) => {
        db.collection(req.params.collections).find().toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })
    })
    // let authkey = "0a5360cc212117217f57589348c4a6b6";
    // //using function to reduce the code and re-use the function
    // function auth(key) {
    //     if (authkey === key) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

// app.get('/', (req, res) => { //base route
//     res.send('Express server default')
// })

app.get('/location', (req, res) => { //multiple routes
    // letkey=req.query.key;


    db.collection('location').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})
app.get('/mealType', (req, res) => {
        if (auth(req.header('basicauth'))) {
            db.collection('mealType').find().toArray((err, result) => {
                if (err) throw err;
                res.send(result)
            })
        } else {
            res.send('unauthorized calling')

        }

    })
    //to get a required state we can use query params//
app.get('/restaurants', (req, res) => {
    let stateId = Number(req.query.stateId); //lets pass the state id in url
    let mealId = Number(req.query.mealId);
    // let cuisineId = Number(req.query.cuisineId);
    //what ever is comming from the url is string
    let query = {}; //empty query
    if (stateId && mealId) {
        query = { state_id: stateId, "mealTypes.meal_Id": mealId }
    } else if (stateId) {
        query = { state_id: stateId }
    }
    // else if (mealId) {
    //     query = { "mealTypes.meal_Id": mealId }
    // } else if (cuisineId) {
    //     query = { cuisine_id: cuisineId }
    // }
    db.collection('restaurants').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})


// app.get('/menu', (req, res) => {
//     db.collection('menu').find().toArray((err, result) => {
//         if (err) throw err;
//         res.send(result)
//     })
// })

app.get(`/filter/:mealId`, (req, res) => {
        let sort = { cost: 1 }
        let mealId = Number(req.params.mealId)
        let cuisineId = Number(req.query.cuisineId)
        let lcost = Number(req.query.lcost)
        let hcost = Number(req.query.hcost)
        let query = {}
        if (req.query.sort) {
            sort = { cost: req.query.sort }
        }

        if (lcost && hcost && cuisineId) {
            query = {
                "mealTypes.mealtype_id": mealId,
                $and: [{ cost: { $gt: lcost, $lt: hcost } }],
                "cuisines.cuisine_id": cuisineId
            }
        } else if (lcost && hcost) {
            query = {
                "mealTypes.mealtype_id": mealId,
                $and: [{ cost: { $gt: lcost, $lt: hcost } }]
            }
        } else if (cuisineId) {
            query = {
                "mealTypes.mealtype_id": mealId,
                "cuisines.cuisine_id": cuisineId
            }
        } else {
            query = {
                "mealTypes.mealtype_id": mealId
            }
        }
        db.collection('restaurants').find(query).sort(sort).toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })
    })
    // app.get('/details/:id',(req,res) => {
    //   let id = mongo.ObjectId(req.params.id)///using object Id
    //   db.collection('restaurants').find({_id:id}).toArray((err,result) => {
    //     if(err) throw err;
    //     res.send(result)
    //   })
    // })

app.get('/details/:id', (req, res) => {
    let id = Number(req.params.id)
    db.collection('restaurants').find({ restaurant_id: id }).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.get('/menu/:id', (req, res) => {
    let id = Number(req.params.id)
    db.collection('menu').find({ restaurant_id: id }).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.get('/orders', (req, res) => {
    let email = req.query.email;
    query = {};
    if (email) {
        //query = { email: email }both sides are same we can write like below
        query = { email }
    }
    db.collection('orders').find(query).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

// placeorder

app.post('/placeOrder', (req, res) => {
    console.log(req.body)
    db.collection('orders').insert(req.body, (err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.put('/updateorder/:id', (req, res) => {
    let oid = Number(req.params.id);
    db.collection('orders').updateOne({ orderId: oid }, {
        $set: {
            "status": req.body.status,
            "bank_name": req.body.bank_name,
            "date": req.body.date
        }
    }, (err, result) => {
        if (err) throw err;
        res.send('order updated')
    })
})

app.delete('/deleteOrder/:id', (req, res) => {
    let oid = mongo.ObjectId(req.params.id)
    db.collection('orders').remove({ _id: oid }, (err, result) => {
        if (err) throw err;
        res.send('Order deleted')
    })
})


//menu on basis user selected ids
app.post('/menuItems', (req, res) => {
    if (Array.isArray(req.body)) {
        db.collection('menu').find({ menu_id: { $in: req.body } }).toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })
    } else {
        res.send('Invalid Input')
    }
})

MongoClient.connect(mongoUrl, (err, client) => {
    if (err) console.log('error while connecting');
    db = client.db('mongodb');
    app.listen(port, (err) => {
        if (err) throw err;
        console.log(`
        Express server listening on port ${port}
        `);
    })
})



//to run this folder npm run dev
//three diff environments in the company
//1.developer environment2.testing environment 3.production environment
//dev==>only push the code in dev environment each env has its own port numbers
//dev are not allowed to push the code in other two environmentsr


//dotenv is used to read the port number in env file
//It must be placed before port number
//after this the port will run in the config environment in .env file.
//nodemon does not restart in .env file==>it should be restarted file.
//nodemon does not restart in .env file==>it should be restarted file.
//nodemon does not restart in .env file==>it should be restarted file.
//nodemon does not restart in .env file==>it should be restarted file.
//nodemon does not restart in .env file==>it should be restarted