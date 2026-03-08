# CRUD-PATRONES-DISE-O
Se va realizar un Crud con 3 patrones de diseño.



# 📊 Base de Datos – Gestión de Empleados

# 📘 CRUD de Empleados con Node.js y MySQL

## 🧑‍🎓 Introducción

Este proyecto fue desarrollado para la materia de **Seminario de Sistemas**.  
Consiste en un sistema CRUD (Crear, Leer, Actualizar, Eliminar) de empleados utilizando Node.js y MySQL, aplicando buenas prácticas y patrones de diseño.

La base de datos se llama `gestion_empleados` y contiene tres tablas:

- empleados
- tipos_empleado
- areas

Cada empleado almacena:
- Nombre
- Email
- Salario
- Tipo de empleado
- Área

---

## 🛠️ Tecnologías utilizadas

- Node.js
- Express
- MySQL
- EJS
- CSS
- dotenv
- mysql2

---

## 📁 Estructura del proyecto


gestion_empleados/
├── config/
│ └── db.js
├── controllers/
│ └── empleadoController.js
├── factories/
│ └── empleadoFactory.js
├── models/
│ └── empleadoModel.js
├── routes/
│ └── empleadoRoutes.js
├── views/
│ ├── empleados.ejs
│ └── empleado-form.ejs
├── public/
│ └── css/
│ └── style.css
├── .env
└── app.js


---

## 🧠 Patrones de Diseño Implementados

### 1️⃣ Singleton (config/db.js)

Garantiza que solo exista una conexión a la base de datos durante toda la ejecución de la aplicación.

```javascript
class Database {
    constructor() {
        if (!Database.instance) {
            Database.instance = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME
            });
        }
        return Database.instance;
    }

## 📁 Tabla: tipos_empleado

Campos:
- id (INT, PK, AUTO_INCREMENT)
- nombre (CHAR)

Datos iniciales:

1 - Administrativo  
2 - Operativo  
3 - Supervisor  

---

## 📁 Tabla: areas

Campos:
- id (INT, PK, AUTO_INCREMENT)
- nombre (CHAR)

Datos iniciales:

1 - Sistemas  
2 - Recursos Humanos  
3 - Logística  

---

## 📁 Tabla: empleados

Campos:
- id (INT, PK, AUTO_INCREMENT)
- nombre (CHAR)
- email (CHAR, UNIQUE)
- salario (DECIMAL)
- fecha_ingreso (DATE)
- tipo_id (INT, FK)
- area_id (INT, FK)

---

## 🔗 Relaciones

- `empleados.tipo_id` → referencia a `tipos_empleado.id`
- `empleados.area_id` → referencia a `areas.id`

---

## 🧠 Descripción del Modelo

Cada empleado pertenece a:
- Un tipo de empleado
- Un área

La base de datos está diseñada bajo principios de normalización y modelo relacional,
permitiendo escalabilidad y mantenimiento profesional.


## Tecnologias a instalar:

Instala Jest como dependencia de desarrollo:
npm install --save-dev jest


