jest.mock('../config/db', () => ({
  query: jest.fn()
}));

const db = require('../config/db');
const EmpleadoRepository = require('./empleadoRepository'); // ya es una instancia
const Empleado = require('../models/empleadoModel');

describe('EmpleadoRepository', () => {
  afterEach(() => jest.clearAllMocks());

  test('obtenerTodos debe retornar lista de empleados', async () => {
    const fakeRows = [{ id: 1, nombre: 'Juan', email: 'juan@ex.com', salario: 1000, tipo_id: 1, area_id: 2, tipo: 'Tipo', area: 'Area' }];
    db.query.mockResolvedValue([fakeRows]);

    const result = await EmpleadoRepository.obtenerTodos({ nombre: 'Juan' });
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Empleado);
    expect(db.query).toHaveBeenCalledWith(expect.stringMatching(/WHERE 1=1.*AND e\.nombre LIKE \?/s),['%Juan%']);
  });

  test('obtenerPorId debe retornar empleado', async () => {
    const fakeRow = { id: 1, nombre: 'Juan', email: 'juan@ex.com', salario: 1000, tipo_id: 1, area_id: 2, tipo: 'Tipo', area: 'Area' };
    db.query.mockResolvedValue([[fakeRow]]);
    const result = await EmpleadoRepository.obtenerPorId(1);
    expect(result).toBeInstanceOf(Empleado);
    expect(result.id).toBe(1);
  });

  test('crear debe retornar insertId', async () => {
    const empleado = new Empleado({ nombre: 'Nuevo', email: 'n@e.com', salario: 2000, fecha_ingreso: '2023-01-01', tipo_id: 1, area_id: 2 });
    db.query.mockResolvedValue([{ insertId: 5 }]);

    const id = await EmpleadoRepository.crear(empleado);
    expect(id).toBe(5);
    // Verificar que se llamó con los campos adicionales (fecha_ingreso)
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO empleados'),
      ['Nuevo', 'n@e.com', 2000, undefined, 1, 2] 
    );
  });

  // Similar para actualizar y eliminar...
});