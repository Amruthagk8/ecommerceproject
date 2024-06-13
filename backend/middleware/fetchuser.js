const jwt = require('jsonwebtoken');

const fetchuser = async (req, res, next) => {
    const token = req.header('auth-token');
    console.log('Token received:', token); 
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user;
        next();
    } catch (err) {
        res.status(401).send({ errors: "Invalid token" });
    }
}

module.exports = fetchuser;
