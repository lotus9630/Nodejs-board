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
    fs.readFile(`./users-list/${id}`,'utf8',(err,data)=>{
        var body = JSON.parse(data)
        console.log(body.password)
        console.log(pw)
        if (body.id == id && body.password == pw){
            res.redirect('/')
        } else {
            res.send("<h1>Login Fail</h1><a href='/'>메인 페이지</a><a href='/signin'>로그인 페이지</a>")
        }
    })
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
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))