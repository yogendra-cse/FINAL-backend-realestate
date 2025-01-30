const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next)=>{
    console.log("Cookies received:", req.cookies); 
    
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "Not authenticated!", reason: "Token missing" });
    }

    jwt.verify(token, "yogendra2005", (err, payload) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token!", reason: err.message });
        }

        req.user = payload.id;

        next();
    });
}

module.exports = verifyToken;