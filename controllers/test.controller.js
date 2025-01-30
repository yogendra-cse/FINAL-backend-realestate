const jwt = require("jsonwebtoken");

const shouldBeLoggedIn = async (req, res) => {
    console.log(req.userId);
    
    console.log("Cookies received:", req.cookies); // Debugging line

    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "Not authenticated!", reason: "Token missing" });
    }

    jwt.verify(token, "my_secret_key", (err, payload) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token!", reason: err.message });
        }
        req.user = payload;
        res.status(200).json({ message: "You are authenticated", user: payload });
    });
};

const shouldBeAdmin = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Not authenticated!" });
    }

    jwt.verify(token, "my_secret_key", async (err, payload) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token!" });
        }

        if (payload.role !== "admin") {
            return res.status(403).json({ message: "Access denied! Admins only." });
        }

        req.user = payload;
        res.status(200).json({ message: "You are an admin", user: payload });
    });
};

module.exports = { shouldBeAdmin, shouldBeLoggedIn };
