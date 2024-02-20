const controller = require('./userController');
const router = require('express').Router();
console.log('subRouter.js');

const addRoutes = (router) => {
  router.get('/users', controller.getAllUsers);
}

module.exports = {
  addRoutes
};