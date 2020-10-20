'use strict';

const path = require('path');

// this will load .env parameters to process.env
const env = require('dotenv').config({path: path.join(__dirname, '../.env')});
const username = ''
const password = ''
const servername=''
const database='WideWorldImporters'

const fs = require('fs');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

const db = {};

let sequelize = new Sequelize(database, username, password, {
  host: 'scorianisql.database.windows.net',
  dialect: 'mssql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  dialectOptions: {
    options:{
      trustServerCertificate: true,
      encrypt: true
    }
  }
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
