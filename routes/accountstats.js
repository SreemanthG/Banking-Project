var express = require('express');
var router = express.Router(),
Customer = require("../models/customer"),
Account = require("../models/account"),
User = require("../models/user"),
Employee = require("../models/employee"),
Transactions = require("../models/transactions");
router.get("/cus/accstatements",isLoggedIn,function(req,res){
    Customer.findById(req.user.userid).populate("account").exec(function(err,foundCustomer){
        if(err){
            console.log(err);
        } else{
            res.render("accountstats/entry",{customer:foundCustomer});
        }
    })
})
router.get("/cus/accstatements/:id",isLoggedIn,function(req,res){
    Account.findById(req.params.id).populate("transactions").exec(function(err,foundAccount){
        if(err){
            console.log(err);
        } else{
            res.render("accountstats/tables",{account:foundAccount});
        }
    })
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;