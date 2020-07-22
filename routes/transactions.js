var express = require('express');
var router = express.Router(),
Customer = require("../models/customer"),
Account = require("../models/account"),
User = require("../models/user"),
Employee = require("../models/employee"),
Transactions = require("../models/transactions");
Fawn = require("fawn");
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/premierebank");
var nodemailer = require("nodemailer");
const prompt = require('prompt');
Fawn.init(mongoose);
var mailuser,mailpass;
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user:"###email###",
        pass: "####password###"
    }
});
var rand,mailOptions,host,link;
/*------------------SMTP Over-----------------------------*/

// const uri = 'mongodb://Sreemanth:27017,Sreemanth:27018,Sreemanth:27019/premierebank';

// (async () => {
//     try {
//         await mongoose.connect(uri, { replicaSet: 'rs' , useNewUrlParser: true });
//         const session = await mongoose.startSession();
//         
        
//     } catch (err) {
//       console.log('error: ' + err)
//     }
//   })()

router.get("/cus/transactions",isLoggedIn,function(req,res){
    Customer.findById(req.user.userid).populate("account").exec(function(err,foundCustomer){
        if(err){
            console.log(err)
        } else{
            res.render("transactions/entry",{customer:foundCustomer});
        }
    })
})

router.get("/cus/transactions/:id/new",isLoggedIn,function(req,res){
    Account.findById(req.params.id).populate("benificiary").exec(function(err,foundAccount){
        if(err){
            console.log(err)
        } else{
            console.log(foundAccount);
            
            res.render("transactions/new",{account:foundAccount});
        }
    })
})
router.put("/cus/trans/check",function(req,res){
    
    transfer(20200002,20200003,300);
    
    
})
router.post("/cus/transactions/:id",isLoggedIn,function(req,res){
    Account.findById(req.params.id).populate("benificiary").exec(function(err,foundAccount){
        if(err){
            console.log(err)
        } else{
            // console.log(+1);

            if(foundAccount.balance>0&&foundAccount.balance>parseInt(req.body.transactions.amount)){
                
            Account.findOne({accountno:req.body.transactions.benacc},function(err,benacc){
                if(err){
                    console.log(err)
                } else{
                    
                    foundAccount.benificiary.forEach(function(bencomp){
                        if(benacc.accountno==bencomp.accountno){

                            (async () => {
                                    try {
                                        console.log(bencomp.accountno+" "+foundAccount.accountno);
                                        
                                        await transfer(parseInt(foundAccount.accountno),parseInt(bencomp.accountno),parseInt(req.body.transactions.amount))
                                        
                                        Transactions.create({from:foundAccount.accountno,to:bencomp.accountno,amount:req.body.transactions.amount},function(err,trans){
                                            if(err){
                                                console.log(err);
                                            } else{
                                                foundAccount.transactions.push(trans);
                                                foundAccount.save();
                                                benacc.transactions.push(trans);
                                                benacc.save();
                                                console.log(foundAccount);
                                                console.log(benacc);
                                             
                                                var receivermail={
                                                    to :"sreemanth2001@gmail.com",
                                                    subject :"Premiere Bank",
                                                    html : "Your amount has been credited from the bank "+req.body.transactions.amount+" <br>"
                                                    };
                                                var sendermail={
                                                    to : "sreemanth2001@gmail.com",
                                                    subject : "Premiere Bank",
                                                    html : "Your amount has been debited from the bank "+req.body.transactions.amount+" <br>"
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
                           
                                        
                        } else{
                            res.redirect("/cus/transactions/")
                        }
                    })
                }
            })
        }
    }
    })
})
//Verify Mail
router.get("/cus/transactions/:id/sendMail",isLoggedIn,function(req,res){
    rand=Math.floor((Math.random() * 10000000) + 54);

    mailOptions={
        to : req.query.to,
        subject : "Please confirm your Transaction",
        html : "Hello,<br> Please Click on the link to verify your email This is your verification id "+rand+" <br>"
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.send("error");
     }else{
            console.log("Message sent: " + response.message);
            res.redirect("/cus/transactions/"+req.params.id+"/sendMail/new");
         }
});
    
})
//Verify Mail
router.get("/cus/transactions/:id/sendMail/new",isLoggedIn,function(req,res){
    res.render("transactions/verify",{accountid:req.params.id});
})
router.post("/cus/transactions/:id/verify",isLoggedIn,function(req,res){
    var randcode = req.body.randcode;
    if(randcode==rand){
        res.redirect("/cus/transactions/"+req.params.id+"/new");
    } else{
        res.send("Try Again: <a href='/cus/transactions/:id/sendMail/new'>Try again</a>")
    }

    
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
// }
    // task.update(Account,{accountno:20200002},{balance:234213234});
    // task.run({useMongoose: true});
        // Account.findOne({accountno:20200002},function(err,doc){
        //     console.log(doc);
            
        // })
//assuming "Accounts" is the Accounts collection
// task.update(Account,{accountno: senderAccountno},{$inc: {balance: -amount}})
//   .update(Account, {accountno: receiverAccountno},  {$inc: {balance: amount}}).run()
// .then(function(results){
//     console.log("success")
//     // return true;
// }) .catch(function(err){
//     // Everything has been rolled back.

//     // log the error which caused the failure
//     throw err;
//     console.log(err);
//     // return false;
//   });
// return bool
}
// async function handleMoneyTransfer(senderAccountId, receiveAccountId, amount) {
//     // connect the DB and get the User Model

    
//     const session = mongoose.startSession();
//   session.startTransaction();
//     try {
//       // always pass session to find queries when the data is needed for the transaction session
//       const sender = await Account.findOne({ accountno: senderAccountId }).session(session);
      
//       // calculate the updated sender balance
//     //   sender.balance = $(sender.balance).subtract(amount);
//     sender.balance = "300";
      
//       // if funds are insufficient, the transfer cannot be processed
//       if (sender.balance < 0) {
//         throw new Error(`User - ${sender.name} has insufficient funds`);
//       }
      
//       // save the sender updated balance
//       // do not pass the session here
//       // mongoose uses the associated session here from the find query return
//       // more about the associated session ($session) later on
//       await sender.save();
      
//       const receiver = await Amount.findOne({ accountno: receiverAccountId }).session(session);
      
//     //   receive.balance = $(receiver.balance).add(amount);
//     receiver.balance = "300";
      
//       await receiver.save();
      
//       // commit the changes if everything was successful
//       await session.commitTransaction();
//     } catch (error) {
//       // if anything fails above just rollback the changes here
    
//       // this will rollback any changes made in the database
//       await session.abortTransaction();
      
//       // logging the error
//       console.error(error);
      
//       // rethrow the error
//       throw error;
//     } finally {
//       // ending the session
//       session.endSession();
//     }
//   }
module.exports = router;