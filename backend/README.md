# Backend Veterinaria

Backend inicial para el sistema de gestion veterinaria.

## Tecnologias

- Node.js
- Express
- Sequelize
- MySQL
- JWT
- bcrypt

## Primer uso

1. Crear la base de datos en MySQL:

```sql
CREATE DATABASE veterinaria_db;
```

2. Copiar `.env.example` a `.env` y completar credenciales.

3. Instalar dependencias:

```bash
npm install
```

4. Levantar el servidor:

```bash
npm run dev
```

## Cambios de base de datos

Antes de levantar una version nueva del backend, ejecutar:

```bash
npm run db:migrate
```

El servidor crea las tablas faltantes al iniciar, pero los cambios sobre tablas existentes
se aplican mediante migraciones controladas.

## Endpoints iniciales

- `POST /api/auth/login`
- `GET /api/usuarios`
- `POST /api/usuarios`
- `PUT /api/usuarios/:id`
- `DELETE /api/usuarios/:id`
- `GET /api/mascotas`
- `POST /api/mascotas`
- `PUT /api/mascotas/:id`
- `DELETE /api/mascotas/:id`
- `GET /api/turnos`
- `POST /api/turnos`
- `PUT /api/turnos/:id`
- `DELETE /api/turnos/:id`
