const httpStatus = require('http-status');

const JobService = require('../services/job.service');

const getAllUnpaidJobs = async (req, res) => {
    try {
        return await JobService.getAllUnpaidJobs(req, res);

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occurred while finding unpaid jobs', error });
    }
};

const payForJob = async (req, res) => {
    try {
        return await JobService.payForJob(req, res);

    } catch (error) {
        console.log(error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occurred while paying for the job', error });
    }
};

module.exports = {
    getAllUnpaidJobs,
    payForJob
};