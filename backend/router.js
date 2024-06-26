const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const newRouter = express.Router();
newRouter.use(bodyParser.json());
newRouter.use(bodyParser.urlencoded({ extended: true }));

fs.readdirSync(path.join(__dirname, './apis')).forEach((moduleName) => {
  const modulePath = path.join(
    __dirname,
    './apis',
    moduleName,
    'controller.js',
  );

  if (fs.existsSync(modulePath)) {
    const module = require(modulePath);
    if (module && typeof module.addRoutes === 'function') {
      module.addRoutes(newRouter);
    }
  }
});

module.exports = newRouter;
