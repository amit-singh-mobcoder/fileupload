import express from 'express'
import cors from 'cors'
import errorHandler from './middlewares/error-handler.middleware'
import routes from './routes/index'
import loggerMiddleware from './middlewares/logger.middleware'

const app = express();

app.use(loggerMiddleware)
app.use(express.json())
app.use(cors())

app.use('/api/v1', routes);

app.use(errorHandler)
export { app }