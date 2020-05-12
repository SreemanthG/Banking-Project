var express = require('express');
var router = express.Router(),
Customer = require("../models/customer"),
Account = require("../models/account"),
User = require("../models/user"),
Employee = require("../models/employee"),
Transactions = require("../models/transactions"),
Checks = require("../models/checks");
function preceedzero(n){
    var s = n+"";
    while (s.length < 4) s = "0" + s;
    return s;
}
function genid(n){
    var s = "CHECK"+preceedzero(n);
    return s;
}

router.get("/cus/check",isLoggedIn,function(req,res){
    Customer.findById(req.user.userid).populate("account").exec(function(err,customer){
        if(err){
            console.log(err);
        } else{
        res.render("checks/entry",{customer:customer});    
        }
    })
})

router.get("/cus/check/:id",isLoggedIn,function(req,res){
    Account.findById(req.params.id).populate("check").exec(function(err,foundAccount){
        if(err){
            console.log(err);
        } else{
            res.render("checks/show.ejs",{account:foundAccount});
        }
    })
})

router.get("/cus/check/:id/gencheck",isLoggedIn,function(req,res){
    Account.findById(req.params.id).populate("checks").exec(function(err,foundAccount){
        if(err){
            console.log(err);
        } else{

                    Checks.count(function(err,c){
                        if(err){
                            console.log(err)
                        }   else{
                            Checks.create({},function(err,checkAcc){
                                if(err){
                                    console.log(err)
                                } else{
                                    checkAcc.checkno = genid(c+1);
                                    checkAcc.save();
                                    foundAccount.check.push(checkAcc);
                                    foundAccount.save();
                                    console.log(foundAccount);
                                    console.log(checkAcc);
                                    res.redirect('/cus/check/'+req.params.id);
                                }
                            })
                        }
                })
            
        }
    })
})

router.post("/cus/check/:id/:checkid",isLoggedIn,function(req,res){
    Checks.findByIdAndUpdate(req.params.checkid,{isLost:true},function(err,check){
        if(err){
            console.log(err);
        } else{
            res.redirect("/cus/check/"+req.params.id)
        }
    })
})
router.get("/emp/addcheck/",isLoggedIn,function(req,res){
    res.render("checks/new");

})
router.post("/emp/addcheck/",isLoggedIn,function(req,res){
    
    res.render("checks/new");
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;