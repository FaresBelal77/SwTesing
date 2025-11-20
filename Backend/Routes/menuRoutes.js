const express = require('express');
const router = express.Router();

const menuController = require('../Controllers/menuController.js');
const authenticationMiddleware = require('../Middleware/authenticationMiddleware.js');
const authorizationMiddleware = require('../Middleware/authorizationMiddleware.js');

// Public route
router.get('/list', menuController.listMenuItems);

// Admin routes
router.post(
  '/add',
  authenticationMiddleware,
  authorizationMiddleware(['admin']),
  menuController.addMenuItem
);
router.put(
  '/edit/:id',
  authenticationMiddleware,
  authorizationMiddleware(['admin']),
  menuController.editMenuItem
);
router.delete(
  '/delete/:id',
  authenticationMiddleware,
  authorizationMiddleware(['admin']),
  menuController.deleteMenuItem
);

module.exports = router;
