const express = require('express');
const router = express.Router();

const menuController = require('../Controllers/menuController.js');
const authorizationMiddleware = require('../Middleware/authenticationMiddleware.js');  // FIXED

// Public route
router.get('/list', menuController.listMenuItems);

// Admin routes
router.post('/add', authorizationMiddleware(['admin']), menuController.addMenuItem);
router.put('/edit/:id', authorizationMiddleware(['admin']), menuController.editMenuItem);
router.delete('/delete/:id', authorizationMiddleware(['admin']), menuController.deleteMenuItem);

module.exports = router;
