/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  await knex.schema.alterTable("todos", (table) => {
    table.integer("piority").notNullable().unsigned().defaultTo(5);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  await knex.schema.alterTable("todos", (table) => {
    table.dropColumn("piority");
  });
};
