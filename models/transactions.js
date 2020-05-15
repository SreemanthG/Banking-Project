var mongoose =require("mongoose");

var transactionSchema = new mongoose.Schema({
    date:{type:Date, default:Date.now()},
    from:Number,
    to:Number,
    amount:Number,
    isCheck: {type:Boolean, default:false}
})

module.exports = mongoose.model("Transactions",transactionSchema);