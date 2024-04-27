const dbConfig = require("./config");

const Sequeliz = require("sequelize");
const Sequelize = new Sequeliz(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
  ssl: true,
  operationsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.Sequelize = Sequelize;
db.register = require("./register")(Sequelize, Sequeliz.DataTypes);


db.Sequelize.sync({ force: false, alter: true }).then(() => {
  console.log("sync false ");
});
module.exports = db;
