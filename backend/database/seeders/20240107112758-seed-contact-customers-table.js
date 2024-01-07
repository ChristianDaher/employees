"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "contact_customers",
      [
        {
          contact_id: 1,
          customer_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          contact_id: 1,
          customer_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          contact_id: 2,
          customer_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          contact_id: 2,
          customer_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("contact_customers", null, {});
  },
};
