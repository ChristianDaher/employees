"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "customers",
      [
        {
          name: "Beirut Hospital",
          phone_number: "+961 01 333 333",
          note: "Beirut hospital where students go to practice",
          customer_code: "CUST0",
          account_number: "1000",
          region_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Hotel Dieu",
          phone_number: "+961 01 111 111",
          note: "Hotel Dieu de France Hospital",
          customer_code: "CUST1",
          account_number: "1001",
          region_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Another Hospital",
          phone_number: "+961 01 222 222",
          note: "Another hospital located in another region of Lebanon",
          customer_code: "CUST2",
          account_number: "1002",
          region_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("customers", null, {});
  },
};
