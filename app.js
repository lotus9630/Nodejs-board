const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const session = require('express-session');
const FileStore = require('session-file-store')(session); // 1
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({  // 2
  secret: 'keyboard cat',  // 암호화
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

app.get('/', (req, res) => {

    var body = ""
    fs.readFile('./views/main.html','utf8',(err,data)=>{
        body = data
        res.send(body)
    })
})

app.post('/signin-process',(req, res) => {

    res.send(req.body)
})

app.get('/signin', (req, res) => {
    var body = ""
    fs.readFile('./views/login/signin.html','utf8',(err,data)=>{
        body = data
        res.send(body)
    })
})

app.get('/signup', (req, res) => {
    var body = ""
    fs.readFile('./views/login/signup.html','utf8',(err,data)=>{
        body = data
        res.send(body)
    })
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))