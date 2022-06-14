const express = require('express')
const router = express.Router()
const userModel = require('../models/user.js')
const bcrypt = require('bcrypt')


router.get("/", (req, res) =>{
    res.render('login')
})

router.get("/logout", (req, res) =>{
    req.session.ID = null
    res.redirect("/")
})

router.post("/login", async(req, res) =>{
    const user = await userModel.findOne({userName : req.body.userName})
    if(user == null)
        res.send("User does not exist")
    else if(await bcrypt.compare(req.body.passWord, user.passWord)){
        req.session.ID = user._id
        res.redirect("/home")
    }
    else
        res.send("Invalid Password")
})

router.post("/signup", (req, res) =>{
    bcrypt.hash(req.body.passWord, 10, async (err, hash) =>{
        if(err)
            console.log(err)
        const doc = new userModel({
            userName : req.body.userName,
            passWord : hash,
            email : req.body.email
        })
        try{
            await doc.save()
            res.redirect("/")
        } catch(err) {
            res.sendStatus(500)
        }
    })
})

module.exports = router;
