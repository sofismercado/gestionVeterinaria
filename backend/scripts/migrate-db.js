require("dotenv").config();
const { sequelize } = require("../src/models");

async function getIndexes(table) {
  const [rows] = await sequelize.query(`SHOW INDEX FROM \`${table}\``);
  return rows;
}

async function getForeignKeys(table) {
  const [rows] = await sequelize.query(
    `SELECT rc.CONSTRAINT_NAME, kcu.COLUMN_NAME, kcu.REFERENCED_TABLE_NAME, kcu.REFERENCED_COLUMN_NAME,
            DELETE_RULE, UPDATE_RULE
       FROM information_schema.REFERENTIAL_CONSTRAINTS rc
       JOIN information_schema.KEY_COLUMN_USAGE kcu
         ON rc.CONSTRAINT_SCHEMA = kcu.CONSTRAINT_SCHEMA
        AND rc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
        AND rc.TABLE_NAME = kcu.TABLE_NAME
      WHERE rc.CONSTRAINT_SCHEMA = DATABASE()
        AND rc.TABLE_NAME = ?`,
    { replacements: [table] }
  );
  return rows;
}

async function columnExists(table, column) {
  const [rows] = await sequelize.query(
    `SELECT COUNT(*) AS total
       FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?`,
    { replacements: [table, column] }
  );
  return rows[0].total > 0;
}

async function removeDuplicateIndexes(table, column, keepName) {
  const indexes = await getIndexes(table);
  const duplicates = indexes.filter(
    (index) => index.Column_name === column && index.Key_name !== keepName
  );

  for (const index of duplicates) {
    await sequelize.query(`ALTER TABLE \`${table}\` DROP INDEX \`${index.Key_name}\``);
    console.log(`Indice duplicado eliminado: ${table}.${index.Key_name}`);
  }
}

async function removeDuplicateForeignKeys(table, column) {
  const foreignKeys = await getForeignKeys(table);
  const duplicates = foreignKeys.filter((foreignKey) => foreignKey.COLUMN_NAME === column);

  for (const foreignKey of duplicates.slice(1)) {
    await sequelize.query(
      `ALTER TABLE \`${table}\` DROP FOREIGN KEY \`${foreignKey.CONSTRAINT_NAME}\``
    );
    console.log(`Clave foranea duplicada eliminada: ${table}.${foreignKey.CONSTRAINT_NAME}`);
  }
}

async function addUniqueIndexIfMissing(table, indexName, columns) {
  const indexes = await getIndexes(table);
  const exists = indexes.some((index) => index.Key_name === indexName);

  if (!exists) {
    const fields = columns.map((column) => `\`${column}\``).join(", ");
    await sequelize.query(
      `ALTER TABLE \`${table}\` ADD UNIQUE INDEX \`${indexName}\` (${fields})`
    );
    console.log(`Indice unico agregado: ${table}.${indexName}`);
  }
}

async function run() {
  try {
    await sequelize.authenticate();
    console.log("Conexion a MySQL establecida.");
    await sequelize.sync();

    const [orphanPets] = await sequelize.query(
      "SELECT COUNT(*) AS total FROM mascota WHERE usuarioId IS NULL"
    );
    if (orphanPets[0].total > 0) {
      throw new Error("Hay mascotas sin duenio. Corregilas antes de ejecutar la migracion.");
    }

    const [duplicateSlots] = await sequelize.query(
      `SELECT fecha, hora, COUNT(*) AS total
         FROM turnos
        WHERE hora IS NOT NULL
        GROUP BY fecha, hora
       HAVING COUNT(*) > 1`
    );
    if (duplicateSlots.length > 0) {
      throw new Error("Hay horarios duplicados. Corregilos antes de ejecutar la migracion.");
    }

    await removeDuplicateIndexes("usuarios", "email", "email");
    await removeDuplicateForeignKeys("mascota", "usuarioId");
    await removeDuplicateForeignKeys("turnos", "clienteId");
    await removeDuplicateForeignKeys("turnos", "adminId");
    await removeDuplicateForeignKeys("turnos", "mascotaId");

    await sequelize.query(
      "ALTER TABLE `mascota` MODIFY COLUMN `usuarioId` INT NOT NULL"
    );
    await sequelize.query(
      "ALTER TABLE `mascota` MODIFY COLUMN `peso` DECIMAL(6, 2) NULL"
    );
    if (!await columnExists("mascota", "avatar")) {
      await sequelize.query(
        "ALTER TABLE `mascota` ADD COLUMN `avatar` ENUM('perro', 'gato', 'conejo', 'loro', 'hamster', 'tortuga') NOT NULL DEFAULT 'perro'"
      );
      console.log("Columna agregada: mascota.avatar");
    }
    await addUniqueIndexIfMissing("turnos", "turnos_fecha_hora_unique", ["fecha", "hora"]);

    console.log("Migracion completada correctamente.");
  } catch (error) {
    console.error("Error al migrar la base de datos:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
