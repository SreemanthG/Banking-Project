var mongoose = require("mongoose");

var cardSchema = mongoose.Schema({
  cardType:String,
  cardno: Number,
  expirationDate: {type:String,default:genExpiry()},
  cvv: Number
})


module.exports = mongoose.model("Card",cardSchema);
function genExpiry() {
    var d = new Date();
    totaldate = d.getMonth()+"/"+(parseInt(d.getFullYear())+4)
    return totaldate
}