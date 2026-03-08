const { listar, mostrarFormularioCrear, crear, mostrarFormularioEditar, actualizar, eliminar } = require('./empleadoController');
const Empleado = require('../models/empleadoModel');
const EmpleadoFactory = require('../factories/empleadoFactory');

// Mockeamos los módulos que el controlador usa
jest.mock('../models/empleadoModel');
jest.mock('../factories/empleadoFactory');

describe('empleadoController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, query: {}, body: {} };
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('listar', () => {
    test('debe renderizar empleados con filtros', async () => {
      req.query = { nombre: 'Pepe', tipo_id: '2', area_id: '3' };
      const empleadosMock = [{ id: 1, nombre: 'Pepe' }];
      Empleado.obtenerTodos.mockResolvedValue(empleadosMock);

      await listar(req, res);

      expect(Empleado.obtenerTodos).toHaveBeenCalledWith({ nombre: 'Pepe', tipo_id: '2', area_id: '3' });
      expect(res.render).toHaveBeenCalledWith('empleados', {
        empleados: empleadosMock,
        filtros: { nombre: 'Pepe', tipo_id: '2', area_id: '3' }
      });
    });

    test('debe manejar error', async () => {
      Empleado.obtenerTodos.mockRejectedValue(new Error('DB error'));
      await listar(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error al listar empleados');
    });
  });

  describe('mostrarFormularioCrear', () => {
    test('debe renderizar formulario vacío', () => {
      mostrarFormularioCrear(req, res);
      expect(res.render).toHaveBeenCalledWith('empleado-form', { empleado: null, action: '/empleados/crear' });
    });
  });

  describe('crear', () => {
    test('debe crear empleado y redirigir', async () => {
      req.body = { nombre: 'Nuevo', email: 'n@e.com' };
      const empleadoCreado = { id: undefined, nombre: 'Nuevo' }; // lo que devuelve factory
      EmpleadoFactory.crearEmpleado.mockReturnValue(empleadoCreado);
      Empleado.crear.mockResolvedValue();

      await crear(req, res);

      expect(EmpleadoFactory.crearEmpleado).toHaveBeenCalledWith(req.body);
      expect(Empleado.crear).toHaveBeenCalledWith(empleadoCreado);
      expect(res.redirect).toHaveBeenCalledWith('/empleados');
    });

    test('debe manejar error', async () => {
      EmpleadoFactory.crearEmpleado.mockImplementation(() => { throw new Error('Factory error'); });
      await crear(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error al crear empleado');
    });
  });

  describe('mostrarFormularioEditar', () => {
    test('debe renderizar con empleado existente', async () => {
      req.params.id = '5';
      const empleadoMock = { id: 5, nombre: 'Juan' };
      Empleado.obtenerPorId.mockResolvedValue(empleadoMock);

      await mostrarFormularioEditar(req, res);

      expect(Empleado.obtenerPorId).toHaveBeenCalledWith('5');
      expect(res.render).toHaveBeenCalledWith('empleado-form', { empleado: empleadoMock, action: '/empleados/5/actualizar' });
    });

    test('debe retornar 404 si no existe', async () => {
      Empleado.obtenerPorId.mockResolvedValue(null);
      await mostrarFormularioEditar(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Empleado no encontrado');
    });
  });

  describe('actualizar', () => {
    test('debe actualizar y redirigir', async () => {
      req.params.id = '5';
      req.body = { nombre: 'Actualizado' };
      const empleadoActualizadoMock = { nombre: 'Actualizado' };
      EmpleadoFactory.crearEmpleado.mockReturnValue(empleadoActualizadoMock);
      Empleado.actualizar.mockResolvedValue();

      await actualizar(req, res);

      expect(EmpleadoFactory.crearEmpleado).toHaveBeenCalledWith(req.body);
      expect(Empleado.actualizar).toHaveBeenCalledWith('5', empleadoActualizadoMock);
      expect(res.redirect).toHaveBeenCalledWith('/empleados');
    });
  });

  describe('eliminar', () => {
    test('debe eliminar y redirigir', async () => {
      req.params.id = '5';
      Empleado.eliminar.mockResolvedValue();
      await eliminar(req, res);
      expect(Empleado.eliminar).toHaveBeenCalledWith('5');
      expect(res.redirect).toHaveBeenCalledWith('/empleados');
    });
  });
});