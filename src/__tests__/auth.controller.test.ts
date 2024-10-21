import { app } from '../app'; 
import request from 'supertest';
import mongoose from 'mongoose';

describe('Authentication test cases', () => {

    beforeAll(async () => {
        try {
            await mongoose.connect('mongodb://localhost:27017/fileupload-test');
            console.log('Connected to test database');
        } catch (error) {
            console.error('Failed to connect to database', error);
        }
    });

    afterAll(async () => {
        try {
            await mongoose.connection.dropDatabase(); 
            await mongoose.connection.close();
            console.log('Database connection closed');
        } catch (error) {
            console.error('Failed to close database connection', error);
        }
    });

    it('should register user successfully', async () => {
        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({
                fname: 'Brat',
                lname: 'Smith',
                email: 'brat.smith@gmail.om',
                password: '12345678',
            });

        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty('data');
        console.log('Test case passed: User registered successfully');
    });
});
