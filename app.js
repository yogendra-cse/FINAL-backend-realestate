const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const postRoute = require('./routes/post.route.js')
const authRoute = require('./routes/auth.route.js')
const testRoute = require('./routes/test.route.js')
const mongoose = require('mongoose')

const port = 3000;

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "https://final-frontend-real-estate.vercel.app",
            "http://localhost:5174"
        ];
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

//DB connectivity
mongoose.connect('mongodb+srv://yogendra:dbPwd@mycluster.u5ayq.mongodb.net/RealEstateDbFinal')
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

app.use('/api/post',postRoute)

app.use('/api/auth', authRoute)

app.use('/api/test', testRoute)

app.listen(port, ()=>{
    console.log(`The server Running on Port ${port}`);
})