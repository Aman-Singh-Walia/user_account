require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWTSECRET;

async function getLoggedInUserId(req,res, next){
    try {
        const token = req.header('auth-token');
        if(!token){
            res.json({success:false,msg:'Failed to fetch user'});
        }else{
            let decodedToken =  jwt.verify(token,jwtSecret)
            req.body.userId = decodedToken.userId;
            next()
        }
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Something went wrong !' });
    }
}

module.exports = getLoggedInUserId;