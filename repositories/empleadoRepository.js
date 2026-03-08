const db = require('../config/db');
const Empleado = require('../models/empleadoModel');

class EmpleadoRepository {
    async obtenerTodos(filtros = {}) {
        let sql = `
            SELECT e.*, t.nombre AS tipo, a.nombre AS area
            FROM empleados e
            JOIN tipos_empleado t ON e.tipo_id = t.id
            JOIN areas a ON e.area_id = a.id
            WHERE 1=1
        `;
        const params = [];

        if (filtros.nombre) {
            sql += ' AND e.nombre LIKE ?';
            params.push(`%${filtros.nombre}%`);
        }
        if (filtros.tipo_id) {
            sql += ' AND e.tipo_id = ?';
            params.push(filtros.tipo_id);
        }
        if (filtros.area_id) {
            sql += ' AND e.area_id = ?';
            params.push(filtros.area_id);
        }

        const [rows] = await db.query(sql, params);
        return rows.map(row => new Empleado(row));
    }

    async obtenerPorId(id) {
        const [rows] = await db.query(`
            SELECT e.*, t.nombre AS tipo, a.nombre AS area
            FROM empleados e
            JOIN tipos_empleado t ON e.tipo_id = t.id
            JOIN areas a ON e.area_id = a.id
            WHERE e.id = ?
        `, [id]);
        return rows.length ? new Empleado(rows[0]) : null;
    }

    async crear(empleado) {
        const sql = `
            INSERT INTO empleados 
            (nombre, email, salario, fecha_ingreso, tipo_id, area_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [
            empleado.nombre,
            empleado.email,
            empleado.salario,
            empleado.fecha_ingreso,
            empleado.tipo_id,
            empleado.area_id
        ]);
        return result.insertId;
    }

    async actualizar(id, empleado) {
        const sql = `
            UPDATE empleados
            SET nombre = ?, email = ?, salario = ?, fecha_ingreso = ?, tipo_id = ?, area_id = ?
            WHERE id = ?
        `;
        await db.query(sql, [
            empleado.nombre,
            empleado.email,
            empleado.salario,
            empleado.fecha_ingreso,
            empleado.tipo_id,
            empleado.area_id,
            id
        ]);
    }

    async eliminar(id) {
        await db.query('DELETE FROM empleados WHERE id = ?', [id]);
    }
}

module.exports = new EmpleadoRepository();