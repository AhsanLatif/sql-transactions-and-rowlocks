const httpStatus = require('http-status');

const BalanceService = require('../services/balance.service');

const addBalance = async (req, res) => {
    try {
        return await BalanceService.addBalance(req, res);

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occurred while finding unpaid jobs', error });
    }
};

module.exports = {
    addBalance
};