const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        console.log('JWTToken', token);
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: err.message });
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Unauthenticated' });
    }
}
