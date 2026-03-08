const Empleado = require('../models/empleadoModel');
const EmpleadoFactory = require('../factories/empleadoFactory');

exports.listar = async (req, res) => {
    try {
        const filtros = {
            nombre: req.query.nombre || '',
            tipo_id: req.query.tipo_id || '',
            area_id: req.query.area_id || ''
        };
        const empleados = await Empleado.obtenerTodos(filtros);
        res.render('empleados', { empleados, filtros });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al listar empleados');
    }
};

exports.mostrarFormularioCrear = (req, res) => {
    res.render('empleado-form', { empleado: null, action: '/empleados/crear' });
};

exports.crear = async (req, res) => {
    try {
        const nuevoEmpleado = EmpleadoFactory.crearEmpleado(req.body);
        await Empleado.crear(nuevoEmpleado);
        res.redirect('/empleados');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear empleado');
    }
};

exports.mostrarFormularioEditar = async (req, res) => {
    try {
        const empleado = await Empleado.obtenerPorId(req.params.id);
        if (!empleado) return res.status(404).send('Empleado no encontrado');
        res.render('empleado-form', { empleado, action: `/empleados/${empleado.id}/actualizar` });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar empleado');
    }
};

exports.actualizar = async (req, res) => {
    try {
        const empleadoActualizado = EmpleadoFactory.crearEmpleado(req.body);
        await Empleado.actualizar(req.params.id, empleadoActualizado);
        res.redirect('/empleados');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar empleado');
    }
};

exports.eliminar = async (req, res) => {
    try {
        await Empleado.eliminar(req.params.id);
        res.redirect('/empleados');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar empleado');
    }
};