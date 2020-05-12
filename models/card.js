var mongoose = require("mongoose");

var cardSchema = mongoose.Schema({
cardType:String,
  number: '4111111111111111',
  expirationDate: {type:Date,default:totaldate()},
  cvv: '100'
})
function genExpiry() {
    var d = new Date();
    totaldate = d.getMonth()+"/"+d.getFullYear()
    return totaldate
}