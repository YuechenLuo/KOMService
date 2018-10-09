/**
 * Expense model class
 * by Peter
 */
'use strict';
class Expense {
    
    constructor(req) {
        for (const key in req.body) {
            this[key] = req.body[key];
        }
    }

}

module.exports = Expense;