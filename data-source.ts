import { DataSource } from "typeorm";
const dbConfig = require('./ormconfig.js');

export const AppDataSource = new DataSource(dbConfig);