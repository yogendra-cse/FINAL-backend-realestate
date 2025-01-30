const express = require('express');
const { route } = require('./post.route');
const { register, login, logout, updateUser } = require('../controllers/auth.controller');

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update", updateUser); 


module.exports = router;
