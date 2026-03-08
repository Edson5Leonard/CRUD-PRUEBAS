// Mockeamos el módulo de base de datos antes de importar el modelo
jest.mock('../config/db', () => ({
  query: jest.fn()
}));

const db = require('../config/db');
const Empleado = require('./empleadoModel');

describe('Empleado Model', () => {
  afterEach(() => {
    jest.clearAllMocks(); // limpia los mocks después de cada prueba
  });

  describe('obtenerTodos', () => {
    test('debe retornar una lista de empleados con filtros aplicados', async () => {
      const fakeRows = [
        { id: 1, nombre: 'Juan', email: 'juan@example.com', salario: 1000, tipo_id: 1, area_id: 2, tipo: 'Tipo1', area: 'Area1' }
      ];
      db.query.mockResolvedValue([fakeRows]); // simula que la consulta devuelve las filas

      const filtros = { nombre: 'Juan', tipo_id: '1', area_id: '2' };
      const result = await Empleado.obtenerTodos(filtros);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Empleado);
      expect(result[0].nombre).toBe('Juan');
      expect(db.query).toHaveBeenCalledTimes(1);
      // Verifica que la consulta SQL incluya los filtros (podríamos inspeccionar los argumentos)
      const [sql, params] = db.query.mock.calls[0];
      expect(sql).toContain('WHERE 1=1');
      expect(sql).toContain('AND e.nombre LIKE ?');
      expect(params).toEqual(['%Juan%', '1', '2']);
    });

    test('debe retornar todos si no hay filtros', async () => {
      const fakeRows = [
        { id: 1, nombre: 'Juan', email: 'juan@example.com', salario: 1000, tipo_id: 1, area_id: 2, tipo: 'Tipo1', area: 'Area1' }
      ];
      db.query.mockResolvedValue([fakeRows]);

      const result = await Empleado.obtenerTodos({});
      expect(result).toHaveLength(1);
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE 1=1'), []);
    });
  });

  describe('obtenerPorId', () => {
    test('debe retornar un empleado si existe', async () => {
      const fakeRow = { id: 1, nombre: 'Juan', email: 'juan@example.com', salario: 1000, tipo_id: 1, area_id: 2, tipo: 'Tipo1', area: 'Area1' };
      db.query.mockResolvedValue([[fakeRow]]);

      const result = await Empleado.obtenerPorId(1);
      expect(result).toBeInstanceOf(Empleado);
      expect(result.id).toBe(1);
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE e.id = ?'), [1]);
    });

    test('debe retornar null si no existe', async () => {
      db.query.mockResolvedValue([[]]); // sin resultados
      const result = await Empleado.obtenerPorId(999);
      expect(result).toBeNull();
    });
  });

  describe('crear', () => {
    test('debe insertar un empleado', async () => {
      const empleadoData = new Empleado({
        nombre: 'Nuevo',
        email: 'nuevo@example.com',
        salario: 2000,
        tipo_id: 1,
        area_id: 2
      });
      db.query.mockResolvedValue([{ insertId: 10 }]);

      await Empleado.crear(empleadoData);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO empleados'),
        ['Nuevo', 'nuevo@example.com', 2000, 1, 2]
      );
    });
  });

  describe('actualizar', () => {
    test('debe actualizar un empleado existente', async () => {
      const empleadoData = new Empleado({
        nombre: 'Actualizado',
        email: 'actual@example.com',
        salario: 3000,
        tipo_id: 2,
        area_id: 3
      });
      db.query.mockResolvedValue([{ affectedRows: 1 }]);

      await Empleado.actualizar(5, empleadoData);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE empleados'),
        ['Actualizado', 'actual@example.com', 3000, 2, 3, 5]
      );
    });
  });

  describe('eliminar', () => {
    test('debe eliminar un empleado', async () => {
      db.query.mockResolvedValue([{ affectedRows: 1 }]);
      await Empleado.eliminar(5);
      expect(db.query).toHaveBeenCalledWith('DELETE FROM empleados WHERE id = ?', [5]);
    });
  });
});