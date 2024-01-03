const express = require('express')
const router = express.Router()
const expenseControle = require('./Utils')
const Expense = require('../../model/Expense')
const moment = require('moment')

router.get('/',function(reqq, res){
    // expenseControle.generateExpenses()
    res.end()
})

router.get('/expenses', function(req,res){
    let d1 = req.query.d1 
    let d2 = req.query.d2

    if(d1!= undefined){
        if(d2 === undefined)
        {
            d2 = moment().format('LLLL')
        }
        Expense.find({$and:[{date:{$gt:d1}}, {date:{$lt:d2}}]}).sort({date : -1}).then(function(expenses){
            res.send(expenses)
        })
    }

    else{
            Expense.find({}).sort({date : -1}).then(function(expenses){
                res.send(expenses)
            })
    }
})

router.post('/expense', function(req, res){
    const expense = req.body
    expense.date = (expense.date != undefined) ? moment(expense.date).format('LLLL') : moment().format('LLLL')
    expenseControle.addExpense(expense)
    .then((result)=>{
        console.log(result)
        res.send(result)
    })
})



router.put('/update/:group1/:group2',function(req,res){
    const group1 = req.params.group1
    const group2 = req.params.group2

    Expense.findOneAndUpdate({groupe : group1}, {groupe: group2}, {new: true}).then(function(result){
        res.send(`${result.item} changed to ${group2}`)
    })
})


router.get('/expenses/:group/:total', function(req, res){
    const group = req.params.group
    const total = req.params.total
    
    if(total){
        Expense.aggregate(
            [ { $match : { groupe: group } } ,{$group:{_id:null, count: {$sum: "$amount"}}}]
        ).then(function(result){
            console.log(result)
            res.send(`${result[0].count}`)
        })
    }
    else{
        Expense.find({groupe: group}).then(function(result){
            res.send(result)
        })
    }
})



module.exports = router