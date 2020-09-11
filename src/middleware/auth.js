require('dotenv').config()
const config = require('config');
 
const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    // const header = req.header('x-auth-token');
    // const token = header.split(" ")[1];
    // console.log('header',header)
    // console.log('pika token',token);
    // if (!token) {
    //     return res.status(401).send('Access denied. No JWT provided.');
    // }
    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET)
    //     req.user = decoded;
    //     next();
    // }
    // catch (ex) {
    //     res.status(400).send('Invalid JWT.');
    // }


    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        console.log('JWTToken',token);
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}