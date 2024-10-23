import { configDotenv } from "dotenv";
import { app } from "./app";
import { DatabaseConnection } from "./config/db-connection";
import { Constants } from "./constants";
import logger from "./utils/logger";

const PORT = Constants.PORT;
const DB_URI = String(Constants.DB_URI);
const DB_NAME = Constants.DB_NAME; 
const db = new DatabaseConnection(DB_URI, DB_NAME);

configDotenv();

const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`)
    try {
        await db.disconnect();
        logger.info('Db connection closed')
    } catch (error) {
        logger.error('Error closing database connection:', error)
    }
    process.exit(1)
}

// Listen for uncaught Exception
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception: ',err)
    gracefulShutdown('uncaughtException')
})

// Listen for handled promise rejection
process.on('unhandledRejection', (reason: any, promise) => {
    logger.error('Unhandled Rejection at: ', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
})

db.connect()
.then(() => {
    app.listen(PORT, () => {
        logger.info(`Server is running at http://locahost:${PORT}`)
    })
})
.catch((err) => {
    logger.error('Failed to connect DB',err);
    process.exit(1);
})