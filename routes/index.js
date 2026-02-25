const indexRouter = require('express').Router();
const awsRouter = require('./awsRouter.js');


indexRouter.get('/health', (req, res) => {
    res.json({ message: 'Welcome to Uttirna AWS Upload Service' });
});

indexRouter.use('/api/aws', awsRouter);

module.exports = indexRouter;
