var mongoose = require("mongoose");
var accountSchema = mongoose.Schema({
    accountno:Number,
    accountname:String,
    branch:String,
    balance:{type:Number, default:"0"},
    accounttype:String,
    mobile:String,
    email:String,
    address:String,
    pin:String,
    isAccepted:{type:Boolean, default:false},
    benificiary:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Benificiary"
    }],
    transactions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Transactions"
    }],
    check:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Checks"
    }]
});
module.exports = mongoose.model("Account",accountSchema);