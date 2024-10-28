
const { Op } = require("sequelize")
const { sequelize } = require('../model')
const getBestProfession = async (req, res) => {
    try {
        const { Profile, Job, Contract } = req.app.get('models')
        const { start, end } = req.query
        const result = await Profile.findOne({
            attributes: [
                'profession',
                [sequelize.fn('sum', sequelize.col('price')), 'totalEarnings']
            ],
            include: [{
                model: Contract,
                as: 'Contractor',
                attributes: [],
                required: true,
                include: [{
                    model: Job,
                    attributes: [],
                    required: true,
                    where: {
                        paid: true,
                        paymentDate: {
                            [Op.gte]: new Date(start),
                            [Op.lte]: new Date(end),
                        },
                    },
                }]
            }],
            group: ['Profile.id'],
            order: [[sequelize.literal('totalEarnings'), 'DESC']],
            raw: true,
            subQuery: false
        });
        res.json(result)
    } catch (error) {
        throw error;
    }
};

const getBestClient = async (req, res) => {
    try {
        const { Profile, Job, Contract } = req.app.get('models')
        const { start, end, limit } = req.query
        console.log(start, end)
        const result = await Profile.findAll({
            attributes: [
                'id',
                [sequelize.literal('firstName || " " || lastName'), 'fullName'],
                [sequelize.fn('sum', sequelize.col('price')), 'paid']
            ],
            include: [{
                model: Contract,
                as: 'Client',
                attributes: [],
                required: true,
                include: [{
                    model: Job,
                    attributes: [],
                    required: true,
                    where: {
                        paid: true,
                        paymentDate: {
                            [Op.gte]: new Date(start),
                            [Op.lte]: new Date(end),
                        },
                    },
                }]
            }],
            group: ['Profile.id'],
            order: [[sequelize.literal('paid'), 'DESC']],
            raw: true,
            subQuery: false,
            limit
        });
        res.json(result)
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getBestProfession,
    getBestClient
};