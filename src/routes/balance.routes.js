const express = require('express');
const { addBalance } = require('../controllers/balance.controller');
const { getProfile } = require('../middleware/getProfile')

const balanceRouter = express.Router();

balanceRouter.post('/deposit/:userId', addBalance);

module.exports = balanceRouter;