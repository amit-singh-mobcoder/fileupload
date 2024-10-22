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