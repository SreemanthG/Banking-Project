var mongoose =require("mongoose");

var transactionSchema = new mongoose.Schema({
    date:{type:Date, default:Date.now()},
    from:Number,
    to:Number,
    amount:Number
})

module.exports = mongoose.model("Transactions",transactionSchema);