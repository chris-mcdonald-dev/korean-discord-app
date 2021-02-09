import mongoose from 'mongoose';
import {databaseConfig} from './config';
import 'dotenv/config';
import '../models';

/* Initialize database connection
______________________________________________________________________________________________________________________*/
console.info('Connection to database...');
const database = mongoose
    .connect(process.env.DATABASE_URI, databaseConfig)
    .then(() => console.log('Connected to database'))
    .catch((e) => throw `Database connection error: ${e}`);

export default database;
