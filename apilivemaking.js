//1.to make live api first install npm mongbdb package==>npm i mongodb
//2.we need two things  ==>npm i body-parser cors

//to generate//authkey generation
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
dotenv.config();
let port = process.env.PORT || 9870; //to run the code in heroku as well as other env's we should need to give process.env.port
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let mongoUrl = process.env.MongoUrl;
let db;
let authkey = "0a5360cc212117217f57589348c4a6b6"
    //using function to reduce the code and re-use the function
function auth(key) {
    if (authkey === key) {
        return true;
    } else {
        return false;
    }
}

app.get('/', (req, res) => { //base route
    res.send('Express server default')
})

app.get('/location', (req, res) => { //multiple routes
    // letkey=req.query.key;
    let key = req.header('basicauth')
    if (authkey === key) {
        db.collection('location').find().toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })
    } else {
        res.send('unauthorized calling')
    }

})
app.get('/mealType', (req, res) => { //multiple routes
    if (auth(req.header('basicauth'))) {
        db.collection('mealType').find().toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        })
    } else {
        res.send('unauthorized calling')

    }

})

app.get('/restaurants', (req, res) => { //multiple routes
    db.collection('restaurants').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})
app.get('/menu', (req, res) => { //multiple routes
    db.collection('menu').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.get('/filter', (req, res) => { //multiple routes
    res.send('This is filter route');
})


MongoClient.connect(mongoUrl, (err, client) => {
    if (err) console.log('error while connecting');
    db = client.db('mongodb');
    app.listen(port, (err) => {
        if (err) throw err;
        console.log(`Express server listening on port ${port}`);
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
//nodemon does not restart in .env file==>it should be restarted