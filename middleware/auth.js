const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 인증 처리 하는 곳

    // 클라이언트 쿠키에서 토큰을 가져온다. (토큰 이름 = x_auth)
    let token = req.cookie.x_auth

    // 토큰을 복호화한 후 유저를 찾는다
    // user 모델에서 메소드를 만들자
    User.findByToken(token, (err, user)=>{
        if (err) throw err;
        if(!user) return res.json({isAuth : false, error :true})
    })

    // 유저가 있으면 인증 Okay

    // 유저가 없으면 인증 No
}

module.exports = {auth};