import express from 'express'
import cors from 'cors'
import errorHandler from './middlewares/error-handler.middleware'
import routes from './routes/index'

const app = express();

app.use(express.json())
app.use(cors())

app.use('/api/v1', routes);

app.use(errorHandler)
export { app }