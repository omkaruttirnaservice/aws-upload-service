const indexRouter = require('express').Router();
const awsRouter = require('./awsRouter.js');

indexRouter.use('/api/aws', awsRouter);

module.exports = indexRouter;
