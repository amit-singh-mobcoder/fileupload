# Unit Testing in Node.js with Express & TypeScript
Unit testing is essential for ensuring the reliability and maintainability of your applications. This guide will walk you through setting up unit testing in a Node.js application using Express and TypeScript.

## Environment Setup

### Step 1: Install Dependencies

To get started, install the necessary testing libraries. Open your terminal and run:

```bash
npm install supertest jest ts-jest @types/jest @types/supertest --save-dev
```

Next, initialize the Jest configuration for TypeScript:
```bash
npx ts-jest config:init
```

### Step 2: Update `jest.config.js`
Ensure that your Jest configuration `(jest.config.js)` looks like the following:
```javascript
/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
  verbose: true,
  forceExit: true,
  // clearMocks: true,
};
```
This configuration sets up Jest to work seamlessly with TypeScript and specifies how tests are matched.

### Step 3: Create Test Folder and Files
1. Inside the `src` directory, create a folder named `__tests__`.
2. In the `__tests__` folder, create a test file following the naming convention `filename.test.ts`.

For example, if you're testing a `user` controller, you can name your test file `user.test.ts`.

### Step 4: Example Test Case
Here’s a `sample` test case for testing a basic `GET` request using supertest:
```typescript
import request from 'supertest';
import { app } from "../app"

describe('GET /api/v1/users', () => {
  it('should return a list of users', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('users');
  });
});
```

### Step 5 Update `package.json`
```
"scripts": {
    "start": "tsc && node dist/app.js",
    "dev": "nodemon src/index.ts",
    "test": "jest"
},
```

### Step 6: Running Your Tests
To run your tests, simply execute the following command in your terminal:
```bash
npm test
```
This command will trigger Jest to find and run all test files matching the specified pattern.

# Winston logger setup guide

### Step 1: Install Dependencies
```bash
npm install winston
```

### Step 2: create util file for logger
`src/utils/logger.ts`

```javascript
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack}) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create the logger
const logger = createLogger({
  level: 'info', // Minimum level of logs to capture
  format: combine(
    colorize(), // Colorize logs
    timestamp(), // Add timestamps to logs
    errors({ stack: true }), // Log errors with stack traces
    logFormat // Apply the custom format
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to file
    new transports.File({ filename: 'logs/combined.log' }) // Log all messages to a file
  ],
});

export default logger;
```


### Step 3: Create a logger middleware
`src/middlewares/logger.middleware.ts`

```javascript
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        let statusColor: string;
        if (res.statusCode >= 200 && res.statusCode < 300) {
            statusColor = '\x1b[32m'; // Green
        } else if (res.statusCode >= 400 && res.statusCode < 500) {
            statusColor = '\x1b[33m'; // Yellow
        } else if (res.statusCode >= 500) {
            statusColor = '\x1b[31m'; // Red
        } else {
            statusColor = '\x1b[0m'; 
        }

        // Reset color after the status code
        const resetColor = '\x1b[0m'; 

        logger.info(`${req.method} ${req.url} - ${statusColor}${res.statusCode}${resetColor} [${duration}ms]`);
    });

    next();
};

export default loggerMiddleware;
```


### Step 4: import middleware in `app.ts`
import logger middleware in app.ts file an use it before every route
```javascript
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
```

