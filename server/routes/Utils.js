const expenses =require('../../expenses')
const Expense = require('../../model/Expense')

class ExpenseController{
    generateExpenses(){
        for(let expense of expenses){
            this.addExpense(expense)
        }
    }

    addExpense(expense){
        let newExpense = new Expense(expense)
        return newExpense.save()
        .then((expense)=>{
            console.log(`you spent ${expense.amount} on ${expense.item}`)
            return expense
        })
        .catch((err)=>{
            console.log("couldn't save")
        })
    }


}
const expenseControle = new ExpenseController()
module.exports = expenseControle