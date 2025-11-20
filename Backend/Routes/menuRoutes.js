const express = require('express');
const router = express.Router();
const menuController = require('../Controllers/menuController');
const { auth, permit } = require('../middleware');

// Public route
router.get('/list', menuController.listMenuItems);

// Admin routes
router.post('/add', auth, permit(['admin']), menuController.addMenuItem);
router.put('/edit/:id', auth, permit(['admin']), menuController.editMenuItem);
router.delete('/delete/:id', auth, permit(['admin']), menuController.deleteMenuItem);

module.exports = router;
