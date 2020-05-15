var express = require('express');
var router = express.Router(),
Customer = require("../models/customer"),
Account = require("../models/account"),
User = require("../models/user"),
Employee = require("../models/employee"),
Benificiary = require("../models/benificiary");

router.get("/cus/benificiary",isLoggedIn,function(req,res){
    Customer.findById(req.user.userid).populate("account").exec(function(err,customer){
        if(err){
            console.log(err);
        } else{
        res.render("benificiary/entry",{customer:customer});    
        }
    })
})
router.get("/cus/benificiary/:id",isLoggedIn,function(req,res){
    Account.findById(req.params.id).populate("benificiary").exec(function(err,account){
        if(err){
            console.log(err);
        } else{
        res.render("benificiary/benificiary",{account:account});    
        }
    })
})


router.get("/cus/benificiary/:id/new",isLoggedIn,function(req,res){
    Account.findById(req.params.id,function(err,foundAccount){
        if(err){
            console.log(err);
        } else{

            res.render("benificiary/new",{account:foundAccount});
        }
    })
    
})

router.get("/cus/benificiary/:id/:benid",isLoggedIn,function(req,res){
    Benificiary.findByIdAndDelete(req.params.benid,function(err,foundBen){
        if(err){
            console.log(err);
        } else{
            res.redirect("/cus/benificiary/"+req.params.id);
        }
    })
    
})
router.post("/cus/benificiary/:id",isLoggedIn,function(req,res){
    Account.findOne({accountno:req.body.benificiary.accountno},function(err,benacc){
        if(err){
            console.log(err);
        } else{
            Account.findById(req.params.id,function(err,acc){
                if(err){
                    console.log(err);
                } else{
                    Benificiary.create(req.body.benificiary,function(err,ben){
                        if(err){
                            console.log(err);
                        } else{
                            acc.benificiary.push(ben);
                            acc.save();
                            console.log(acc);
                            res.redirect("/cus/benificiary");
                        }
                    })
                }
            })

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