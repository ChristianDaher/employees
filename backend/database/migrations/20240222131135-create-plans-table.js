"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("plans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      date: {
        type: Sequelize.DATE,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      contact_customer_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "contact_customers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      how: {
        type: Sequelize.STRING,
      },
      objective: {
        type: Sequelize.STRING,
      },
      output: {
        type: Sequelize.STRING,
      },
      offer: {
        type: Sequelize.STRING,
      },
      meeting: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      note: {
        type: Sequelize.STRING,
      },
      completed_at: {
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("plans");
  },
};
