"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "plans",
      [
        {
          date: new Date(),
          user_id: 1,
          contact_customer_id: 1,
          how: "Email",
          objective: "Discuss project 123's requirements",
          output:
            "the conclusion of the meeting was that the project is feasible",
          offer: "$10 000 for the project",
          meeting: "Scheduled",
          status: "Pending",
          note: "First plan made",
          completed_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          date: new Date(),
          user_id: 1,
          contact_customer_id: 1,
          how: "Zoom",
          objective: "Discuss project 321's requirements",
          output:
            "the conclusion of the meeting was that the project is impossible to do with the current resources",
          offer: "No offer made",
          meeting: "Planned",
          status: "Completed",
          note: "First plan failed",
          completed_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("plans", null, {});
  },
};
