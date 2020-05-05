var mongoose = require("mongoose");

var empSchema = new mongoose.Schema({
    accounttype:String,
    salary: String,
    mobile:String,
    email:String,
    username: String,
    address:String,
    userid: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

module.exports = mongoose.model("Employee",empSchema);