const typeRouter = require('express').Router();
// const { authOK } = require('../controllers/login');

const { 
    getAllTypes, 
} = require('../controllers/getTypes');

typeRouter.get('/getAll', getAllTypes);

module.exports = typeRouter;