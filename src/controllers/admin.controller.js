const httpStatus = require('http-status');

const AdminService = require('../services/admin.service');

const getBestProfession = async (req, res) => {
    try {
        return await AdminService.getBestProfession(req, res);

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occurred while finding best profession', error });
    }
};

const getBestClient = async (req, res) => {
    try {
        return await AdminService.getBestClient(req, res);

    } catch (error) {
        console.log(error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occurred while finding best client', error });
    }
};

module.exports = {
    getBestProfession,
    getBestClient
};