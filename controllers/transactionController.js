const transactionModel = require('../models/transactionModel');
const moment = require('moment');

const getAllTransaction = async (req, res) => {
    try {
        const { frequency, selectedDate, type, userid } = req.body;
        
        // Base query
        const query = {
            userid,
            ...(type !== 'all' && { type })
        };
        
        // Add date filtering based on frequency
        if (frequency === 'custom' && selectedDate.length === 2) {
            query.date = {
                $gte: moment(selectedDate[0]).startOf('day').toDate(),
                $lte: moment(selectedDate[1]).endOf('day').toDate()
            };
        } else if (frequency !== 'all') {
            query.date = {
                $gt: moment().subtract(Number(frequency), 'd').toDate()
            };
        }

        const transactions = await transactionModel.find(query);
        res.status(200).json(transactions);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const deleteTransaction = async (req, res) => {
    try {
        await transactionModel.findOneAndDelete({_id:req.body.transactionId})
        res.status(200).send("Transaction Deleted!")
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const editTransaction = async (req, res) => {
    try {
        await transactionModel.findOneAndUpdate({ _id: req.body.transactionId }, req.body.payload);
        res.status(200).send("Edit Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const addTransaction = async (req, res) => {
    try {
        const newTransaction = new transactionModel(req.body);
        await newTransaction.save();
        res.status(201).send('Transaction Created');
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports = { getAllTransaction, addTransaction, editTransaction, deleteTransaction };
