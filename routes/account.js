var express = require('express');
var router = express.Router(),
Customer = require("../models/customer"),
Account = require("../models/account"),
User = require("../models/user"),
Employee = require("../models/employee"),
Card = require("../models/card");


function preceedzero(n){
    var s = n+"";
    while (s.length < 4) s = "0" + s;
    return s;
}
function genid(n){
    var s = "2020"+preceedzero(n);
    return s;
}
function gencard(n){
    var s =  Math.floor(1000000000 + Math.random() * 9000000000).toString() + preceedzero(n);
    return s;
}
router.get("/cus/profile/acc/new",isLoggedIn,function(req,res){
    res.render("accounts/new")
})
router.post("/cus/profile/acc",isLoggedIn,function(req,res){
    Customer.findById(req.user.userid,function(err,foundCustomer){
        if(err){
            console.log(err)
        } else{
           console.log(foundCustomer);
            Account.create(req.body.account,function(err,newlyCreated){
                if(err){
                 console.log(err);
                } else{
                    Account.count(function(err,c){
                        if(err){
                            console.log(err)
                        }   else{
                            newlyCreated.accountno = genid(c+1);
                            newlyCreated.save();
                            foundCustomer.account.push(newlyCreated);
                            foundCustomer.save();
                            console.log(newlyCreated);
                            res.redirect("/cus/profile");
                        }
                    })

                }
            })
            
        }
    })
   
 })

 router.get("/cus/profile/acc/:id",isLoggedIn,function(req,res){
        Customer.findById(req.user.userid,function(err,foundEmployee){
            if(err){
                console.log(err)
            } else{
                // console.log(foundEmployee)
                foundEmployee.account.forEach(function(accountid){
                    if(accountid==req.params.id){
                        Account.findById(req.params.id).populate("card").exec(function(err,foundAccount){
                            if(err){
                                console.log(err)
                            } else{
                                res.render("accounts/show",{account:foundAccount});
                            }
                        })
                    } else{
                        console.log("Not found")
                        // back();
                    }
                })
            }
        })
 })

 router.post("/cus/profile/acc/:id/gencard",isLoggedIn,function(req,res){
     Account.findById(req.params.id,function(err,foundAccount){
         if(err){
            console.log(err)
         } else{
            if(req.body.type == "credit"){
                if(foundAccount.isCredit){
                    console.log("Already Have an card");
                    res.redirect("/cus/profile/acc/"+req.params.id)
                } else{
                    Card.create({cardType:"credit"},function(err,createdCard){
                        if(err){
                            console.log(err);
                            
                        } else{
                        console.log("Hello"+createdCard);
                        Card.count(function(err,c){
                            if(err){
                                console.log(err)
                            }   else{
                            createdCard.cardno= gencard(c+1);
                            createdCard.cvv = Math.floor(Math.random()*900);
                            createdCard.save();
                            foundAccount.card.push(createdCard);
                            foundAccount.isCredit = true;
                            foundAccount.save();
                            console.log(createdCard);
                            console.log(foundAccount);
                            res.redirect("/cus/profile/acc/"+req.params.id)
                            }
                        })
                        }
                        
                       
                    })
                }
             }
             else if(req.body.type == "debit"){
                if(foundAccount.isDebit){
                    console.log("Already Have an card");
                    res.redirect("/cus/profile/acc/"+req.params.id)
                } else{
                    Card.create({cardType:"debit"},function(err,createdCard){
                        if(err){
                            console.log(err);
                            
                        } else{
                        console.log("Hello"+createdCard);
                        Card.count(function(err,c){
                            if(err){
                                console.log(err)
                            }   else{
                            createdCard.cardno= gencard(c+1);
                            createdCard.cvv = Math.floor(Math.random()*900);
                            createdCard.save();
                            foundAccount.card.push(createdCard);
                            foundAccount.isDebit = true;
                            foundAccount.save();
                            console.log(createdCard);
                            console.log(foundAccount);
                            res.redirect("/cus/profile/acc/"+req.params.id)
                            }
                        })
                        }
                    })
                }
             }
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