const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const session = require('express-session');
const FileStore = require('session-file-store')(session); // 1
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.use(session({
    secret: 'asadlfkj!@#!@#dfgasdg',
    resave: false,
    saveUninitialized: true,
    store:new FileStore()
}))

app.get('/', (req, res) => {
    
    var body = ""
    fs.readFile('./views/main.html','utf8',(err,data)=>{
        body = data
        res.send(body)
    })
})

app.get('/signin', (req, res) => {
    var body = ""
    fs.readFile('./views/login/signin.html','utf8',(err,data)=>{
        body = data
        res.send(body)
    })
})

app.post('/signin', (req, res) => {
    var id = req.body.id
    var pw = req.body.password
    var id_list = []
    res.send("Login page")
})


app.get('/signup', (req, res) => {
    var body = ""
    fs.readFile('./views/login/signup.html','utf8',(err,data)=>{
        body = data
        res.send(body)
    })
})

app.post('/signup',(req, res) => {
    var data = JSON.stringify(req.body)
    fs.writeFile(`./users-list/${req.body.id}`, data ,(err)=>{
        if (err) throw err;
        console.log('The file has been saved!')
    })
    res.redirect('/')
})

app.get('/create',(req, res) => {
    res.send()
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))