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
    pin:Number,
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
    }],
    card:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Card"
    }],
    isCredit: {type:Boolean,default:false},
    isDebit: {type:Boolean,default:false}
});
module.exports = mongoose.model("Account",accountSchema);