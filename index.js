const express = require('express')
const path = require('path')
const app = express();

const mongoose = require('mongoose')
const mongoURL = "mongodb+srv://nishit:AWiHJVPVZFndQxvO@cluster0.rq3kt.mongodb.net/?retryWrites=true&w=majority"
mongoose
  .connect(mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((res) => {
    console.log('Mongodb Connected');
  });


const cookieParser = require("cookie-parser")
const sessions = require('express-session')
const duration = 1000 * 60 * 15

app.use(sessions({
    secret: "HighlysecretSauce",
    saveUninitialized: true,
    cookie : {maxAge: duration},
    resave : false
}))

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

function isUserLogged(req, res, next){
    if(req.session.ID)
        next()
    else
        res.redirect("/")
}


const login = require('./routes/login')
const home = require("./routes/home")

app.use("/", login)
app.use("/home", isUserLogged, home)


const port=process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));