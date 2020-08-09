const express = require('express')
const app = express()
const port = 3000
const session = require('express-session');
const fs = require("fs")
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session);    
const template = require('./views/template.js')
const methodOverride = require('method-override')


const options ={
    host: 'localhost',
    port: 3306,
    user     : 'root',
    password : '111111',
    database : 'free_board'
};

const sessionStore = new MySQLStore(options);                   

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'free_board'
});

app.use(session({                                              
  secret:"asdfasffdas",
  resave:false,
  saveUninitialized:true,
  store: sessionStore                                         
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    let title_list="<ul>"
    connection.query(`select title from writing_list`, function (error, results, fields) {
        if (error) {
            throw(error)
        } else {
            results.forEach(element => {
                title_list = title_list + `<li><a href="/page/${element.title}">${element.title}</a></li>`
            });
            title_list = title_list + "</ul>"
            if (req.session.logined == true) {
                res.send(template.body(
                    `<li class="nav-item active">
                    <a class="nav-link" href="/">Home
                        <span class="sr-only">(current)</span>
                    </a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/">${req.session.nickname}</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/logout">Logout</a>
                    </li>`,
                    `<a href="/create"><button type="button" class="btn btn-success">글 쓰기</button></a>`,  
                    `<h1>${title_list}</h1>`
                ))
        
            } else {
                res.send(template.body(
                    `<li class="nav-item active">
                    <a class="nav-link" href="/">Home
                        <span class="sr-only">(current)</span>
                    </a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/signin">Signin</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/signup">Signup</a>
                    </li>`,
                    ``, // 비로그인시 button 비활성화
                    `<h1>${title_list}</h1>`
                ))
            }
        };
    });
})

app.get('/create',(req, res) => { // 글 쓰기 UI 요청
    if (req.session.logined == false){
        res.redirect('/')
    } else {
        res.send(template.body(
            `<li class="nav-item active">
            <a class="nav-link" href="/">Home
                <span class="sr-only">(current)</span>
            </a>
            </li>
            <li class="nav-item">
            <a class="nav-link" href="/signin">${req.session.nickname}</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" href="/logout">Logout</a>
            </li>`,
            ``,  
            `<form action="/create" method="POST">
                <p>
                    <input name="title" type="text"  placeholder="제목">
                </p>
                <p>
                    <textarea name="description" placeholder="내용"></textarea>
                </p>
                <p>
                    <input type="submit" class="fadeIn fourth" value="제출 하기">
                </p>
                
                
             </form>
            
            `
        ))
    }
    
})

app.post('/create',(req,res)=>{ // 글 생성 
    connection.query(`INSERT INTO writing_list(title, description, writer) 
    VALUES ("${req.body.title}", "${req.body.description}", "${req.session.nickname}");`, function (error, results, fields) {
        if (error) {
            throw(error)
        } else {
            connection.end();
            res.redirect("/")
        };
    });
})

app.get('/page/:title', (req, res) => {
    connection.query(`select description from writing_list where title="${req.params.title}" `, function (error, results, fields) {
        res.send(`
            <h1>${req.params.title}</h1>
            <h3>${results[0].description}</h3>
            
            <button type="button" class="btn btn-default"><a href="/">메인 페이지</a></button>
            
            <form style="display:flex" method="POST" action="/update/${req.params.title}">
                <input type="hidden" name="_method" value="PUT">
                <input type="hidden" name="description" value="${results[0].description}">
                <button type="submit" class="btn btn-info">글 수정</button>
            </form>
            
            <form style="display:flex" method="POST" action="/delete/${req.params.title}?_method=DELETE">
                <input type="hidden" name="_method" value="DELETE">
                <button type="submit" class="btn btn-danger">글 삭제</button>
            </form>
            
            <!-- 합쳐지고 최소화된 최신 CSS -->
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
            
            <!-- 부가적인 테마 -->
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css">
            
            <!-- 합쳐지고 최소화된 최신 자바스크립트 -->
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
            <style> form {display:flex}, h1 {color:red} </style>
        `)
    })
})

app.post('/update/:title',(req,res)=>{
    const title = req.params.title
    const nickname = req.session.nickname
    const logined= req.session.logined
    console.log(req.body)
    console.log(req.body.description)

    connection.query(`select writer from writing_list where title = "${title}"`, function (error, results, fields) {
        const writer = results[0].writer

        if (nickname != writer || logined == false) {
            res.redirect('/')
        } else {
            res.send(`
            <form action="/update/${title}?_method=PUT" method="POST">
                <p>
                    <input name="new_title" type="text" value="${title}">
                    <input name="old_title" type="hidden" value="${title}">
                </p>
                <p>
                    <textarea name="new_description" >${req.body.description}</textarea>
                    <input name="old_description" type="hidden" value="${req.body.description}">
                </p>
                <p>
                    <input type="submit" class="fadeIn fourth" value="제출 하기">
                </p>
            </form>
            `)
        }
    })
})

app.put('/update/:title',(req,res)=>{

    connection.query(`update writing_list set title="${req.body.new_title}", description="${req.body.new_description}" 
    where title="${req.body.old_title}" and description="${req.body.old_description}" and writer="${req.session.nickname}"`, function (error, results, fields) {
        res.redirect(`/`)        
    })
})

app.delete('/delete/:title', (req, res) => {
    const title = req.params.title
    const nickname = req.session.nickname
    const logined= req.session.logined
    connection.query(`select writer from writing_list where title = "${title}"`, function (error, results, fields) {
        const writer = results[0].writer

        if (nickname != writer || logined == false) {
            res.redirect('/')
        } else {
            connection.query(`delete from writing_list where title = "${title}"`, function (error, results, fields) {
                res.redirect('/') 
            })
        }
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
    var pw = req.body.pw
    connection.query(`select salt,pw,nickname from user_list where id="${id}"`,function(error,results){
        if (results[0] == undefined) {
            connection.end()
            res.send('<h1>아이디가 일치하지 않습니다</h1>')
        } else {
            var salt = results[0].salt
            var crypto_pw = results[0].pw
            var nickname = results[0].nickname
            crypto.pbkdf2(pw, salt, 100000, 10, 'sha512', (err, key) => {
                if (crypto_pw != key.toString('base64')){
                    res.send('<h1>비밀번호가 일치하지 않습니다</h1>')
                } else {        
                    req.session.save(()=>{
                        req.session.logined = true;
                        req.session.nickname = nickname;
                        res.redirect('/')
                    })
                }
            });
        }
    })
})


app.get('/signup', (req, res) => { // 회원 가입 폼 요청
    var body = ""
    fs.readFile('./views/login/signup.html','utf8',(err,data)=>{
        body = data
        res.send(body)
    })
})

app.post('/signup',(req, res) => { // 회원가입 정보 DB에 저장 
    var body = req.body
    var id = body.id
    var pw = ""
    var salt = ""
    var nickname = body.nickname

    connection.query(`select * from user_list where id=${id} or nickname=${nickname}`,function(error,results){
        console.log(results)
        if(results != undefined){
            connection.end()
            res.redirect('/signup_fail')
        } else {
            crypto.randomBytes(10, (err, buf) => {
                crypto.pbkdf2(body.pw, buf.toString('base64'), 100000, 10, 'sha512', (err, key) => {
                  salt = buf.toString('base64')
                  pw = key.toString('base64');
                  connection.query(`INSERT INTO user_list(id, pw, salt, nickname) VALUES ("${id}", "${pw}", "${salt}","${nickname}")`, function (error, results, fields) {
                    if (error) {
                        throw(error)
                    } else {
                        connection.end();
                        res.redirect("/")
                    };
                  });
                });
            });
        }
    })
    
})

app.get('/signup_fail',(req, res)=>{ // 회원 가입 실패
    fs.readFile('./views/login/signup_fail.html','utf8',(err,data)=>{
        res.send(data)
    })
})

app.get('/logout',(req,res)=>{ // 로그아웃 
    req.session.logined = false 
    req.session.save(()=>{
    })
    req.session.destroy(function(){
        req.session;
        res.redirect('/');
    });
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))