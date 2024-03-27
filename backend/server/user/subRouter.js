const controller = require('./userController');
const addRoutes = (router) => {
  router.get('/api/getUser', controller.getUser);
  router.post('api/newUser', controller.newUser);
  router.post('/api/user/new-post', controller.newPost);
};
module.exports = {
  addRoutes,
};
