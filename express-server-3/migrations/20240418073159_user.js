/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.createTable("user", (table) => {
    table.string("firstname", 25).notNullable();
    table.string("lastname", 25).notNullable();
    table.string("email").unique();
    table.string("password", 25).notNullable();
    table.string("role").notNullable().defaultTo("0x01");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTable("todos");
};
