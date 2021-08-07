const express = require("express"); // express 모듈 가져오기
const app = express(); // express의 function을 이용해 app을 만들기
const port = 5000; // 포트를 지정해서 백 서버 생성
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {auth} = require('./middleware/auth');


const config = require("./config/key"); // exports된 config 폴더의 key.js를 가져온다.

//body-parser에 옵션 주기
app.use(bodyParser.urlencoded({ extended: true })); // application/x-www-form-urlencoded의 형태 데이터를 분석해서 디비에 넣게

app.use(bodyParser.json()); // application/json 형태의 데이터를 분석해서 디비에 넣게
app.use(cookieParser());

const { User } = require("./models/User");
//User 정보 가져와서 인스턴스 만들기
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World! 안녕하세요 :)"));

// postman
app.post('/api/user/register', (req, res) => {
  //회원가입할 때 필요한 정보들을 client에서 가져오면, 그것들을 데이터 베이스에 넣는다.

  const user = new User(req.body) //bodyParser를 이용해서 req에 데이터를 넣게 해준다.

  // 비밀번호 암호화 후 저장 메소드 추가
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });

    return res.status(200).json({
      success: true
    });
  }); //몽고DB에서 오는 메소드(user모델에 데이터를 저장시킴)
});
/*
'/register'은 라우터의 end point라고 한다. 
*/

// 로그인 기능
app.post("/login", (req, res) => {
  // 요청된 이메일을 데이터 베이스에서 있는 지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
  }

  // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 지 확인한다.
  user.comparePassword(req.body.password, (err, isMatch) => {
    if(!isMatch) 
    return res.json({loginSuccess : false, message : "비밀번호가 틀렸습니다."
  })
  
  //비밀번호가 맞을 때 토큰을 생성하기
  user.generateToken((err, user)=>{
    if(err) return res.status(400).send(err);
      
    // 토큰을 쿠키 혹은 로컬스토로지에 저장한다. (쿠키 사용을 위해 express에서 제공되는 cookie-parser을 설치)
    res.cookie("x_auth", user.token) ;

  })

  // 비밀번호까지 맞다면 해당 User를 위한 Token을 생성한다.
});


app.get('/api/users/auth', auth, (req, res) => {



})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));