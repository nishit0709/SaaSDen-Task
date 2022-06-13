const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName:{
        type: String,
        required: true,
        unique: true,
    },
    passWord:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    notes:[{
            heading: String,
            tags: [String],
            body: String,    
    }]
})

module.exports = mongoose.model('user', userSchema);