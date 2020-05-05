var mongoose = require("mongoose");

var empSchema = new mongoose.Schema({
    username: String,
    accounttype:String,
    gender:String,
    dob:Date,
    adhaar:String,
    salary:{type:String, default:"0"},
    mobile:String,
    email:String,
    address:String,
    userid: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

module.exports = mongoose.model("Employee",empSchema);