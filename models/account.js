var mongoose = require("mongoose");
var accountSchema = mongoose.Schema({
    accountno:String,
    accountname:String,
    accountType:String,
    balance:String,
    mobile:String,
    email:String,
    description:String,
    isAccepted:Boolean
});
module.exports = mongoose.model("Account",accountSchema);