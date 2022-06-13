const express = require('express')
const path = require('path')
const app = express();
const userModel = require('./models/user')

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







app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended: true}));
app.use(express.json())


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/',(req, res) =>{
    res.render('login')
})

app.post('/', async (req,res) =>{
    const user = await userModel.findOne({userName : req.body.userName})
    
    if(user == null)
        res.send("User does not exist")
    else if(user.passWord != req.body.passWord)
        res.send("Invalid Password")
    else 
        res.send("Successfully Logged in")
    
        console.log("Login request received")
})

app.post('/signup', async(req,res) =>{
    const doc = new userModel({
        userName : req.body.userName,
        passWord : req.body.passWord,
        email : req.body.email
    })
    await doc.save()
    console.log("signup request received")
})

app.get('/home', (req,res) => {
    //cookie goes here
    const user = userModel.findOne({userName: req.body.userName})
    data = {
        userName : user.userName,
        notes : user.notes
    }   
    res.render('home', data)
})

app.post('/home', (req,res) =>{
    console.log("Note post request received")

    const user = req.body.userName //cookie goes here
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

