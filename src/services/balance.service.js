const { Sequelize, Op } = require("sequelize")
const { sequelize } = require('../model')
const httpStatus = require('http-status');

const addBalance = async (req, res) => {
    const t = await sequelize.transaction({
        isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    });
    const { Profile, Job, Contract } = req.app.get('models')
    const { userId } = req.params;
    const { depositAmount } = req.body

    try {
        const sumResult = await Job.findOne({
            transaction: t,
            attributes: [
                [sequelize.fn('sum', sequelize.col('price')), 'totalAmount']
            ],
            where: { paid: null },
            include: [{
                model: Contract,
                where: {
                    ClientId: userId,
                },
                attributes: [],
                lock: t.LOCK.UPDATE,
            }],
            raw: true,
            lock: t.LOCK.UPDATE,
        });
        const maxAllowedDeposit = sumResult.totalAmount * 0.25;

        if (depositAmount > maxAllowedDeposit) {
            return res.status(httpStatus.BAD_REQUEST).send("deposit more than 25% his total of jobs to pay").end();
        }
        const client = await Profile.findByPk(userId)
        client.balance = Number(client.balance) + Number(depositAmount);
        await client.save({ transaction: t });

        await t.commit();
        return res.status(200).send("Balance Updated Successfully").end();
    } catch (error) {
        await t.rollback();
        console.error('Transaction has been rolled back', error);
        throw error;
    }
}

module.exports = {
    addBalance
};