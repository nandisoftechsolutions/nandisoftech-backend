module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    youtubeLink: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  return Video;
};
