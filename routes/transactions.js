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
Fawn.init(mongoose);
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
                                                res.send("success");
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