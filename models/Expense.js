/**
 * Expense model class
 * by Peter
 */
'use strict';
class Expense {
    
    constructor(req) {
        this.title = req.body.title ? req.body.title : this.title;
        this.desc = req.body.desc ? req.body.desc : this.desc;
        this.payment_method = req.body.payment_method ? req.body.payment_method : this.payment_method;
        this.amount = req.body.amount ? req.body.amount : this.amount;
        this.currency = req.body.currency ? req.body.currency : this.currency;
    }
}

module.exports = Expense;