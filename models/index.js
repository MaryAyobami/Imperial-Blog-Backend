'use strict';
const fs = require('fs');
const {Sequelize, DataTypes} = require('sequelize');
const path = require('path');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config,{
    dialect: 'mysql',
    dialectOptions: {decimalNumbers: true}
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config,  {
    dialect: 'mysql',
    dialectOptions: {decimalNumbers: true}
  }
   );
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Blog =  require('./blog.js')(sequelize,DataTypes)
db.BlogDraft =  require('./blogDraft.js')(sequelize,DataTypes)
db.BlogAdmin =  require('./blogadmin.js')(sequelize,DataTypes)
db.Newsletter =  require('./newsletter.js')(sequelize,DataTypes)
db.NewsletterRecipients =  require('./newsletterRecipients.js')(sequelize,DataTypes)

module.exports = db;
