module.exports = (sequelize, DataTypes) => {
  const CodeReview = sequelize.define('CodeReview', {
    language: { type: DataTypes.STRING, allowNull: false, defaultValue: 'python' },
    code: { type: DataTypes.TEXT, allowNull: false },
    aiSuggestions: { type: DataTypes.TEXT },
    lintReport: { type: DataTypes.TEXT }
  }, {
    tableName: 'code_reviews',
    timestamps: true
  });
  return CodeReview;
};
