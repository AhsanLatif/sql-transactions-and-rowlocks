const express = require('express');
const { getBestProfession, getBestClient } = require('../controllers/admin.controller');

const adminRouter = express.Router();

adminRouter.get('/best-profession', getBestProfession);
adminRouter.get('/best-clients', getBestClient);

module.exports = adminRouter;