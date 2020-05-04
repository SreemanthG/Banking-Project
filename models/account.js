var mongoose = require("mongoose");
var accountSchema = mongoose.Schema({
    accountid:String,
    accountname:String,
    accountType:String,
    balance:String,
    mobile:String,
    email:String,
});
module.exports = mongoose.model("Account",accountSchema);