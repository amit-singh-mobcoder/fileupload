import mongoose from 'mongoose'
import { Constants } from '../constants';

class DatabaseConnection {
    private DB_URI:string;
    private DB_NAME: string;

    constructor(dbUri: string, dbName: string){
        this.DB_URI = dbUri;
        this.DB_NAME = dbName;
    }

    async connect(){
        try {
            const connectionInstance = await mongoose.connect(`${this.DB_URI}/${this.DB_NAME}`);
            console.log(`Db connected successfully, DB_HOST: ${connectionInstance.connection.host}, DB_NAME: ${connectionInstance.connection.name}`)
        } catch (error) {
            console.error('Database connection failed', error);
            process.exit(1)
        }
    }
}

export default new DatabaseConnection(Constants.DB_URI!, Constants.DB_NAME)


