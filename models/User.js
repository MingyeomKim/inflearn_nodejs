const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10; // salt의 크기를 지정

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // String에서 space부분을 없애준다.
    unique: 1, // 중복 방지
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    // 유효성 관리
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  // 비밀번호를 암호화 시킨다.
  var user = this; // user은 User 스키마를 가리킴

  // 다른 요소가 아닌 password가 변경되었을 때만 비밀번호가 암호화되어 저장되도록 한다.
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err); // next로 이동하면 바로 save함수가 실행
      // salt가 잘 생성되면 아래 문구가 실행
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next(); // save로 돌아가기
      });
      // user.password : user 스키마의 plain password(가공되지 않은 비밀번호)
      // salt : 생성된 salt
      // hash : 암호화된 비밀번호
    });
  } else {
    next();
  }
});
// user정보를 저장하기 전에 function을 실행하게끔

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // 매개변수에는 plainPassword와 콜백함수
  // plainPassword 1234567와 암호화된 비밀번호가 같은지 체크
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch); // 이때 isMatch = true
  });
};

userSchema.methods.generateToken = function(cb){

  var user = this;

  //josnwebtoken 을 이용해서 token을 생성하기

  var token = jwt.sign(user._id, 'secretToken');
  user.token = token;
  user.save(function(err, user){
    if (err) return cb(err);
    cb(null, user);
  }
}

const User = mongoose.model("User", userSchema);
// 모듈의 사용성을 늘리기 위해 exports
module.exports = { User };
