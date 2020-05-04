var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password:String,
    accounttype:String,
    account:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account"
    }],
    mobile:String,
    email:String,
    address:String,
})

module.exports = mongoose.model("User",userSchema);