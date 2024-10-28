const express = require('express');
const { getAllUnpaidJobs, payForJob } = require('../controllers/job.controller');
const { getProfile } = require('../middleware/getProfile')

const jobRouter = express.Router();

jobRouter.get('/unpaid', getProfile, getAllUnpaidJobs);
jobRouter.post('/:job_id/pay', getProfile, payForJob);

module.exports = jobRouter;