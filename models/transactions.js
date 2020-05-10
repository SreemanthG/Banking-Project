var mongoose =require("mongoose");

var transactionSchema = new mongoose.Schema({
    date:{type:Date, default:Date().now},
    from:String,
    to:String,
    amount:String
})

module.exports = mongoose.model("Transactions",transactionSchema);