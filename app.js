const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')

app.get('/', (req, res) => {
    var body = ""
    fs.readFile('./views/main.html','utf8',(err,data)=>{
        body = data
        console.log(body)
        res.send(body)
    })
})

app.get('/signin', (req, res) => res.send('로그인 페이지'))

app.get('/signup', (req, res) => res.send('회원가입 페이지'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))