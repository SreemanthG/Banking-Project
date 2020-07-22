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
var Fawn = require("fawn");
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/premierebank");
var nodemailer = require("nodemailer");
const prompt = require('prompt');
// Fawn.init(mongoose);
var mailuser,mailpass;
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user:"##email##",
        pass: "##password##"
    }
});
var rand,mailOptions,host,link;
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
    res.render("checks/empcheck");
})
router.post("/emp/addcheck/",isLoggedIn,function(req,res){
    // (async () => {
    //     try {
        
            Checks.findOne({checkno:req.body.check.checkno},function(err,check){
                if(err){
                    console.log(err);
                    res.send("invalid Check")
                } else{
                    if(check.isUsed||check.isLost){
                        console.log(err);
                        res.send("already used");
                    } else{
                    Account.findOne({accountno:req.body.check.from},function(err,foundAccount){
                        if(err){
                            console.log(err);
                        } else{
                            Account.findOne({accountno:req.body.check.to},function(err,benAccount){
                                if(err){
                                    console.log(err);
                                } else{
                                    (async () => {
                                        try {
                                    await transfer(parseInt(foundAccount.accountno),parseInt(benAccount.accountno),parseInt(req.body.check.amount))            
                                    Transactions.create({from:foundAccount.accountno,to:benAccount.accountno,amount:req.body.check.amount,isCheck:true},function(err,trans){
                                        if(err){
                                            console.log(err);
                                        } else{
        
                                            check.isUsed= true;
                                            check.save();
                                            foundAccount.transactions.push(trans);
                                            foundAccount.save();
                                            benAccount.transactions.push(trans);
                                            benAccount.save();
                                            console.log(foundAccount);
                                            console.log(benAccount);
                                         
                                            var receivermail={
                                                to :"sreemanth2001@gmail.com",
                                                subject :"Premiere Bank",
                                                html : "Your amount has been credited from the bank "+req.body.check.amount+" <br>"
                                                };
                                            var sendermail={
                                                to : "sreemanth2001@gmail.com",
                                                subject : "Premiere Bank",
                                                html : "Your amount has been debited from the bank "+req.body.check.amount+" <br>"
                                            }
                                          
                                        
                                            smtpTransport.sendMail(receivermail, function(error, response1){
                                             if(error){
                                                    console.log(error);
                                                     res.send("error Occured sending mail");
                                             }else{
                                                smtpTransport.sendMail(sendermail, function(error, response2){
                                                    if(error){
                                                           console.log(error);
                                                            res.send("error Occured sending mail");
                                                    }else{
                                                          res.send("success")
                                                        }
                                              
                                           })
                                                 }
                                       
                                    })
                                        }
                                    })
                                } catch (err) {
                                    console.log('error: ' + err)
                                  }
                                })()
                                }
                            })
                            
                        }
                    })  
                }
                }
            })
        // } catch (err) {
        //     console.log('error: ' + err)
        //   }
        // })()
        

})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
async function transfer(senderAccountno,receiverAccountno,amount){
    var task = Fawn.Task();
// try{
    task.update(Account, {accountno: senderAccountno},  {$inc: {balance: -amount}});
    task.update(Account, {accountno: receiverAccountno},  {$inc: {balance: amount}});
    task.run({useMongoose: true})
    .then(function(){
        // update is complete
      })
      .catch(function(err){
        // Everything has been rolled back.
        
        // log the error which caused the failure
        console.log(err);
      });

}
module.exports = router;