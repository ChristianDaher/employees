"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          first_name: "Jean",
          last_name: "Daher",
          phone_number: "+961 71 123 123",
          email: "jeandaher@gmail.com",
          department_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          first_name: "Johnny",
          last_name: "Hannah",
          phone_number: "+961 71 234 567",
          email: "johnnyhannah@gmail.com",
          department_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          first_name: "Christian",
          last_name: "Daher",
          phone_number: "+961 70 849 994",
          email: "christiandaher@gmail.com",
          department_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
