'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('contacts', [{
      first_name: 'Anthony',
      last_name: 'Aaraj',
      KOL: false,
      phone_number: '+961 81 664 303',
      email: 'anthonyaaraj3@gmail.com',
      title: 'Doctor',
      note: 'Student at USJ',
      department_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      first_name: 'Maria',
      last_name: 'Kadado',
      KOL: true,
      phone_number: '+961 70 134 282',
      email: 'mariakadado2002@gmail.com',
      title: 'Director',
      note: 'Financial Director of the finance department',
      department_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('contacts', null, {});
  }
};
