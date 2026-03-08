const Empleado = require('../models/empleadoModel');

class EmpleadoFactory {
    static crearEmpleado(data) {
        return new Empleado({
            nombre: data.nombre,
            email: data.email,
            salario: parseFloat(data.salario),
            tipo_id: parseInt(data.tipo_id),
            area_id: parseInt(data.area_id)
        });
    }
}

module.exports = EmpleadoFactory;