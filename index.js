const express = require('express')
const path = require('path')
const app = express();

const mongoose = require('mongoose')

// const mongoURL = //mongoDB ATLAS URL
// mongoose
//   .connect(mongoURL,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then((res) => {
//     console.log('Mongodb Connected');
//   });


app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended: true}));
app.use(express.json())


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/home', (req,res) => {
    res.render('home')
})

const port=process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));

