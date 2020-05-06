var mongoose = require("mongoose");
var accountSchema = mongoose.Schema({
    accountno:String,
    accountname:String,
    branch:String,
    balance:{type:String, default:"0"},
    accounttype:String,
    mobile:String,
    email:String,
    address:String,
    pin:String,
    isAccepted:{type:Boolean, default:false}
});
module.exports = mongoose.model("Account",accountSchema);