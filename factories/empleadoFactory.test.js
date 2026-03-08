const EmpleadoFactory = require('./empleadoFactory');
const Empleado = require('../models/empleadoModel');

describe('EmpleadoFactory', () => {
  test('crearEmpleado debe construir una instancia de Empleado con los datos proporcionados', () => {
    const data = {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      salario: '2500.50',
      tipo_id: '1',
      area_id: '2'
    };

    const empleado = EmpleadoFactory.crearEmpleado(data);

    expect(empleado).toBeInstanceOf(Empleado);
    expect(empleado.nombre).toBe('Juan Pérez');
    expect(empleado.email).toBe('juan@example.com');
    expect(empleado.salario).toBe(2500.50); // debe ser número
    expect(empleado.tipo_id).toBe(1);       // debe ser entero
    expect(empleado.area_id).toBe(2);        // debe ser entero
  });

  test('debe manejar correctamente valores faltantes', () => {
    const data = {
      nombre: 'Ana',
      email: 'ana@example.com',
      salario: '3000',
      // tipo_id y area_id ausentes
    };

    const empleado = EmpleadoFactory.crearEmpleado(data);

    expect(empleado.nombre).toBe('Ana');
    expect(empleado.salario).toBe(3000);
    expect(empleado.tipo_id).toBeNaN(); // parseInt de undefined da NaN
    expect(empleado.area_id).toBeNaN();
  });
});