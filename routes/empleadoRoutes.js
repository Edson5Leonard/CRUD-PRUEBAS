const express = require('express');
const router = express.Router();
const controller = require('../controllers/empleadoController');

router.get('/', controller.listar);
router.get('/nuevo', controller.mostrarFormularioCrear);
router.post('/crear', controller.crear);
router.get('/:id/editar', controller.mostrarFormularioEditar);
router.post('/:id/actualizar', controller.actualizar);
router.post('/:id/eliminar', controller.eliminar);

module.exports = router;