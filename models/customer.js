var mongoose = require("mongoose");

var cusSchema = new mongoose.Schema({
    username: String,
    accounttype:String,
    account:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account"
    }],
    mobile:String,
    email:String,
    address:String,
    userid: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

module.exports = mongoose.model("Customer",cusSchema);