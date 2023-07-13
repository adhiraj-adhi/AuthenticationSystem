const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const token = req.cookies.userLoggedIn;

    // check json web token exists and is verified
    if(token){
        jwt.verify(token, process.env.PRIVATE_KEY, (err, decodedToken) => {
            if(err) {
                // console.log(err.message);
                res.redirect("/");
            } else {
                // console.log(decodedToken); // o/p is somewhat like :- { id: '642e5ca9d1d525789bc6cf7a', iat: 1680764537, exp: 1681023737 }
                next();
            }
        })
    } else {
        res.redirect("/");
    }
}

module.exports = checkAuth;