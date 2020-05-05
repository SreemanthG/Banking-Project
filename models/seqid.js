var mongoose = require("mongoose");

var seqidSchema = new mongoose.Schema({
    accnumber: String
})

module.exports = mongoose.model("Seqid",seqidSchema);