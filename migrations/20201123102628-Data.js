module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Users',
      'avatar',
      {
        type: Sequelize.STRING,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'avatar');
  },
};
