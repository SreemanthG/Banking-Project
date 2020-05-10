var express = require('express');
var router = express.Router(),
Customer = require("../models/customer"),
Account = require("../models/account"),
User = require("../models/user"),
Employee = require("../models/employee");
router.get("/cus",isLoggedIn,function(req,res){
    
    res.redirect("/cus/index")
 });
router.get("/cus/index",isLoggedIn,function(req,res){
    User.find({},function(err,foundUser){
        if(err){
            console.log(err)
        } else{
            res.render("index",{user:foundUser});
        }
    })
})

router.get("/cus/profile",isLoggedIn,function(req,res){
    if(req.user.usertype=="Customer"){
    Customer.findById(req.user.userid).populate("account").exec(function(err,foundCustomer){
        if(err){
            console.log(err)
        } else{

            res.render("accounts/profile",{user:foundCustomer});

    }
    
})
} else{
    Employee.findById(req.user.userid,function(err,foundEmployee){
        if(err){
            console.log(err)
        } else{
            console.log(foundEmployee)
            res.render("accounts/profile",{user:foundEmployee});
    }
    
})
}
})


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;