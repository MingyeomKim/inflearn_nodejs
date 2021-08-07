const express = require("express");
const app = express();
const port = 5000;

const { User } = require("./models/User"); // User.js 스키마를 가져와서 model 생성

const mongoose = require("mongoose");
mongoose
  .connect("mongooseDB에서 가져온 URL 정보", {
    useNewParser: true,
    userUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello, World!"));

app.post("/register", (req, res) => {
  const user = new User(req.body); // user 객체 생성
  user.save((err, useInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

app.post("./login", (req, res) => {
  User.findOne({ email: req.body.email }),
    (err, user) => {
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다.",
        });
      }
    };
});

// User.js에서 앞서 생성한 comparePassword 메소드로
user.comparePassword(req.body.password, (err, isMatch) => {
  if (!isMatch)
    // 비밀번호가 맞지 않을 때
    return res.json({
      loginSuccess: false,
      message: "비밀번호가 틀렸습니다. ",
    });

  user.generateToken((err, user) => {});
});

// comparePassword 함수 만들기
userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
