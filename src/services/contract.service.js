
const { Op } = require("sequelize")
const { sequelize } = require('../model')
const getAllContracts = async (req, res) => {
    try {
        const { Contract } = req.app.get('models')
        const contract = await Contract.findAll({
            where: {
                [Op.or]: {
                    ClientId: req.profile.id,
                    ContractorId: req.profile.id,
                },
                status: {
                    [Op.ne]: 'terminated'
                }
            }
        })
        res.json(contract)
    } catch (error) {
        throw error;
    }
}
/**
 * FIX ME!
 * @returns contract by id
 */
const getContractById = async (req, res) => {
    try {
        const { Contract } = req.app.get('models')
        const { id } = req.params
        const contract = await Contract.findOne({
            where: {
                id: id,
                [Op.or]: {
                    ClientId: req.profile.id,
                    ContractorId: req.profile.id,
                },
            }
        })
        if (!contract) return res.status(404).end()
        res.json(contract)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
}

module.exports = {
    getContractById,
    getAllContracts
};