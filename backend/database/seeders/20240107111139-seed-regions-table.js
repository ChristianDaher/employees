"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "regions",
      [
        {
          name: "Beirut",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Ashrafieh",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("regions", null, {});
  },
};
