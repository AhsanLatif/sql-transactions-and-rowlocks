
const { Sequelize, Op } = require("sequelize")
const { sequelize } = require('../model')
const httpStatus = require('http-status');
const getAllUnpaidJobs = async (req, res) => {
    try {
        const { Contract, Job } = req.app.get('models')
        const jobs = await Job.findAll({
            where: {
                paid: null
            },
            include: [{
                model: Contract,
                where: {
                    [Op.or]: {
                        ClientId: req.profile.id,
                        ContractorId: req.profile.id,
                    },
                    status: {
                        [Op.ne]: 'terminated'
                    }
                },
                attributes: []
            }]
        })
        res.json(jobs)
    }
    catch (error) {
        throw error;
    }
}

const payForJob = async (req, res) => {
    const t = await sequelize.transaction({
        isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    });
    const { Profile, Job, Contract } = req.app.get('models')
    const { job_id } = req.params;

    try {
        const job = await Job.findOne({
            transaction: t,
            where: {
                id: job_id,
            },
            include: {
                model: Contract,
                as: 'Contract',
                where: { ClientId: req.profile.id },
                lock: t.LOCK.UPDATE,
                include: [
                    { model: Profile, as: 'Client', lock: t.LOCK.UPDATE },
                    { model: Profile, as: 'Contractor', lock: t.LOCK.UPDATE }
                ],
            },
            lock: t.LOCK.UPDATE
        })

        if (!job) {
            await t.commit();
            return res.status(httpStatus.NOT_FOUND).send("No such job exist").end();
        }
        if (job.paid) {
            await t.commit();
            return res.status(httpStatus.BAD_REQUEST).send("Job is already paid for").end();
        }
        if (job.Contract.status == 'terminated') {
            await t.commit();
            return res.status(httpStatus.BAD_REQUEST).send("Job is in terminated state. Payment cannot be made").end();
        }
        if (job.Contract.Client.balance < job.price) {
            await t.commit();
            return res.status(httpStatus.BAD_REQUEST).send("Not Enough Balance").end();
        }

        const updatedClientBalance = job.Contract.Client.balance - job.price
        await Profile.update({
            balance: updatedClientBalance.toFixed(2)
        }, {
            where: { id: job.Contract.ClientId },
            transaction: t
        })

        const updatedContractorBalance = job.Contract.Contractor.balance + job.price
        await Profile.update({ balance: updatedContractorBalance.toFixed(2) }, {
            where: { id: job.Contract.ContractorId },
            transaction: t
        })

        await Job.update({ paid: 1, paymentDate: Date.now() }, {
            where: { id: job_id },
            transaction: t
        })
        await t.commit();

        return res.status(200).send("Payment Successful").end();
    } catch (error) {
        await t.rollback();
        console.error('Transaction has been rolled back', error);
        throw error;
    }
}

module.exports = {
    getAllUnpaidJobs,
    payForJob
};