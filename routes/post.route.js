const express = require('express');

const router = express.Router();

router.get("/test", (req, res)=>{
    res.send("ore wa jack")
});

module.exports = router;