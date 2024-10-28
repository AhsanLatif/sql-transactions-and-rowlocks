const express = require('express');
const { getAllContracts, getContractById } = require('../controllers/contract.controller');
const { getProfile } = require('../middleware/getProfile')
const contractRouter = express.Router();

contractRouter.get('/:id', getProfile, getContractById);
contractRouter.get('/', getProfile, getAllContracts);

module.exports = contractRouter;