const express = require('express')
const path = require('path')
const app = express();
const userModel = require('./models/user')
const bcrypt = require('bcrypt')


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


app.get('/',(req, res) =>{
    res.render('login')
})

app.post('/', async (req,res) =>{
    console.log("Login request received")
    const user = await userModel.findOne({userName : req.body.userName})
    if(user == null)
        res.send("User does not exist")

    const match = await bcrypt.compare(req.body.passWord, user.passWord)
    
    if(match){
        req.session.userName = user.userName
        res.send("Successfully Logged in")
    }
    else
        res.send("Invalid Password")   
})

app.post('/signup', async(req,res) =>{
    console.log("signup request received")
    bcrypt.hash(req.body.passWord, 10, (err, hash) =>{
        const doc = new userModel({
            userName : req.body.userName,
            passWord : hash,
            email : req.body.email
        })
        await doc.save()
    })
})

app.get('/home', (req,res) => {
    //cookie goes here
    const user = userModel.findOne({userName: req.session.userName})
    data = {
        userName : user.userName,
        notes : user.notes
    }   
    res.render('home', data)
})

app.post('/home', (req,res) =>{
    console.log("Note post request received")

    const user = req.session.userName //cookie goes here
    const note = {
        heading : req.body.heading,
        tags : req.body.tags,
        body : req.body.body
    }

    userModel.findOneAndUpdate(
        {userName: user},
        {
            $push : {
                notes: note
            }
        },
        (err, result) => {
            if(err)
                console.log("Error Pushing to the DB")
            else
                console.log("Note Succesfully Logged")
        });
})

const port=process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));

