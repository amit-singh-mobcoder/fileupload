import mongoose from 'mongoose'
import logger from '../utils/logger';

export class DatabaseConnection {
    private DB_URI:string;
    private DB_NAME: string;

    constructor(dbUri: string, dbName: string){
        if (!dbUri || !dbName) {
            throw new Error('DB_URI and DB_NAME must be provided.');
        }
        this.DB_URI = dbUri;
        this.DB_NAME = dbName;
    }

    async connect(){
        try {
            const connectionInstance = await mongoose.connect(`${this.DB_URI}/${this.DB_NAME}`);
            logger.info('Db connected successfully')
            logger.info(`DB-HOST : ${connectionInstance.connection.host}`)
            logger.info(`DB-NAME : ${connectionInstance.connection.name}`)
        } catch (error) {
            logger.error('Database connection failed', error);
            process.exit(1)
        }
    }

    async disconnect(){
        try {
            await mongoose.connection.close()
            logger.info('Db connection closed')
        } catch (error) {
            logger.error('Error while closing db connection',error)
        }
    }
}



