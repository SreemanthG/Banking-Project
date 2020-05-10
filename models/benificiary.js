var mongoose = require("mongoose");
var benificiarySchema = mongoose.Schema({
    username: String,
    accountno: String,
    email:String,
    mobile:String,
    isAccepted:{type:Boolean, default:false}
});
module.exports = mongoose.model("Benificiary",benificiarySchema);