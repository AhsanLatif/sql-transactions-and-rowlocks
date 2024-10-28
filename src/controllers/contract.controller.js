const httpStatus = require('http-status');

const ContractService = require('../services/contract.service');

const getAllContracts = async (req, res) => {
    try {
        return await ContractService.getAllContracts(req, res);

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occurred while getting all contracts', error });
    }
};

const getContractById = async (req, res) => {
    try {
        return await ContractService.getContractById(req, res);

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occurred while contract', error });
    }
};

module.exports = {
    getAllContracts,
    getContractById
};