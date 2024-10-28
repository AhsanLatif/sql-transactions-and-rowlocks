const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

const adminRouter = require('./routes/admin.routes');
const contractRouter = require('./routes/contract.routes')
const jobRouter = require('./routes/job.routes')
const balanceRouter = require('./routes/balance.routes')

app.use('/admin', adminRouter);
app.use('/contracts', contractRouter);
app.use('/jobs', jobRouter);
app.use('/balances', balanceRouter);


module.exports = app;
