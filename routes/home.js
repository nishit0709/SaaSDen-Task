const express = require('express')
const router= express.Router()
const userModel = require('../models/user.js')


router.get("/", async(req, res) =>{
    const user = await userModel.findOne({_id: req.session.ID})
    data = {
        userName : user.userName,
        notes : user.notes,
    }  
    res.render('home', {data:data})
})

router.get("/note", async(req, res) =>{
    const noteID = req.query.noteID;
    const userID = req.session.ID
    let data = {
        note : { heading : "", tags: [], body: ""},
        link : "/home/add"
    }
    if(noteID){
        const doc = await userModel.findOne({_id : userID})
        data = await{ note : doc.notes.id(noteID), link : "/home/edit/?noteID=" + noteID }
    }
    res.render("note", {data : data})
    })

router.get("/del", (req, res) =>{
    const userID = req.session.ID 
    const docID = req.query.noteID
    const filter =  {_id: userID}
    const update =  {$pull: {"notes" : {"_id" : docID}}}
    
    userModel.findOneAndUpdate(filter, update, (err, result) => {
        if(err)
            res.sendStatus(500)
        else
            res.redirect("/home")
    })
})

router.post("/add", (req, res) =>{
    console.log("Note post request received")
    const userID = req.session.ID
    const note = {
        heading : req.body.heading,
        tags : (req.body.tags),
        body : req.body.body
    }
    const filter = {_id:userID}
    const update = {$push : {notes:note}}

    userModel.findOneAndUpdate(filter, update, (err, result) => {
        if(err)
            res.sendStatus(500)
        else
            res.redirect("/home")
    })
})

router.post("/edit", (req, res) =>{
    const userID = req.session.ID 
    const docID = req.query.noteID
    const newNote = {
        _id : docID,
        heading : req.body.heading,
        tags : req.body.tags,
        body : req.body.body
    }
    console.log(newNote)
    const filter =  {_id: userID, "notes._id" : docID}
    const update =  {$set: {"notes.$" : newNote}}
    userModel.findOneAndUpdate(filter, update, (err, result) => {
        if(err)
            res.sendStatus(500)
        else
            res.redirect("/home")
    })
})

module.exports = router;
