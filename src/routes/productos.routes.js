const express = require('express');
const controller = require('../controllers/productos.controller');
// const {getAll, getById} = require('../controllers/productos.controller');

const router = express.Router()

router.get('/',controller.getAllVisible)
router.get('/all',controller.getAll)
router.get('/:id', controller.getById)
router.post('/',controller.create)
router.put('/:id',controller.update)
router.delete('/:id', controller.remove)

module.exports = { router };