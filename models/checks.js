var mongoose = require("mongoose");

var checkSchema= new mongoose.Schema({
    checkno:String,
    Date:{type:Date, default: Date.now()},
    amount:Number,
    from:{type:mongoose.Schema.Types.ObjectId, ref:"Account"},
    to:{type:mongoose.Schema.Types.ObjectId, ref:"Account"},
    isUsed:{type:Boolean,default:false},
    isLost:{type:Boolean,default:false}
})
module.exports = mongoose.model("Checks",checkSchema)