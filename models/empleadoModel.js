const db = require('../config/db');

class Empleado {
    constructor({ id, nombre, email, salario, tipo_id, area_id, tipo, area }) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.salario = salario;
        this.tipo_id = tipo_id;
        this.area_id = area_id;
        this.tipo = tipo;
        this.area = area;
    }

    // Obtener todos con filtros opcionales
    static async obtenerTodos(filtros = {}) {
        let sql = `
            SELECT e.*, t.nombre AS tipo, a.nombre AS area
            FROM empleados e
            JOIN tipos_empleado t ON e.tipo_id = t.id
            JOIN areas a ON e.area_id = a.id
            WHERE 1=1
        `;
        const valores = [];
        if (filtros.nombre) {
            sql += ' AND e.nombre LIKE ?';
            valores.push(`%${filtros.nombre}%`);
        }
        if (filtros.tipo_id) {
            sql += ' AND e.tipo_id = ?';
            valores.push(filtros.tipo_id);
        }
        if (filtros.area_id) {
            sql += ' AND e.area_id = ?';
            valores.push(filtros.area_id);
        }
        const [rows] = await db.query(sql, valores);
        return rows.map(row => new Empleado(row));
    }

    static async obtenerPorId(id) {
        const [rows] = await db.query(`
            SELECT e.*, t.nombre AS tipo, a.nombre AS area
            FROM empleados e
            JOIN tipos_empleado t ON e.tipo_id = t.id
            JOIN areas a ON e.area_id = a.id
            WHERE e.id = ?
        `, [id]);
        return rows.length ? new Empleado(rows[0]) : null;
    }

    static async crear(empleado) {
        const sql = `
            INSERT INTO empleados 
            (nombre, email, salario, tipo_id, area_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.query(sql, [
            empleado.nombre,
            empleado.email,
            empleado.salario,
            empleado.tipo_id,
            empleado.area_id
        ]);
    }

    static async actualizar(id, empleado) {
        const sql = `
            UPDATE empleados
            SET nombre = ?, email = ?, salario = ?, tipo_id = ?, area_id = ?
            WHERE id = ?
        `;
        await db.query(sql, [
            empleado.nombre,
            empleado.email,
            empleado.salario,
            empleado.tipo_id,
            empleado.area_id,
            id
        ]);
    }

    static async eliminar(id) {
        await db.query('DELETE FROM empleados WHERE id = ?', [id]);
    }
}

module.exports = Empleado;