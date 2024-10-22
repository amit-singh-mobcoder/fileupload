import { app } from "../app"
import request from "supertest"
import mongoose from "mongoose"
import path from 'path'
import fs from 'fs'
import { UserModel } from "../models/user.model"
import { Constants } from "../constants"
import { JwtWrapper } from "../utils/jwt-wrapper"

describe('Auth Controller Testing', () => {
    beforeAll(async () => {
        try {
            await mongoose.connect('mongodb://localhost:27017/fileupload-test')
            console.log('db connected successfully')
        } catch (error) {
            console.error('Failed to connect db', error);
        }
    })

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        console.log('mongodb connection closed')
    })

    describe('POST /api/v1/auth/register', () => {
        // TEST CASE 1
        it('should fail if avatar is missing', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .field("fname", "John")
                .field("lname", "Snow")
                .field("email", "johnsnow@gmail.com")
                .field("password", "12345678");

            expect(response.status).toBe(400); 
            expect(response.body).toHaveProperty("message", "Avatar is missing.");
        });

        // TEST CASE 2
        it('should fail if any field is missing or empty', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .field("fname", "John")
                .field("lname", "Snow")
                .field("email", "")
                .field("password", "12345678")

            expect(response.status).toBe(400); 
            expect(response.body).toHaveProperty("message", "Validation failed");
        });

        // TEST CASE 3
        it('should register successfully', async () => {
            const avatarPath = path.join(__dirname, '../../', 'public/temp', 'test-avatar.png');
            // console.log("Avatar path:", avatarPath);
            expect(fs.existsSync(avatarPath)).toBe(true);

            const response = await request(app)
                .post('/api/v1/auth/register')
                .field("fname", "John")
                .field("lname", "Snow")
                .field("email", "johnsnow@gmail.com")
                .field("password", "12345678")
                .attach("avatar", avatarPath)
        
            expect(response.status).toBe(201); 
            expect(response.body).toHaveProperty("message", "User created successfully.");
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty("fname", "John");
            expect(response.body.data).toHaveProperty("lname", "Snow");
            expect(response.body.data).toHaveProperty("email", "johnsnow@gmail.com");
            expect(response.body.data).not.toHaveProperty("password");
            // console.log("response", response.body)
        });

        it('should fail if user already exist', async () => {
            const avatarPath = path.join(__dirname, '../../', 'public/temp', 'test-avatar.png');
            // console.log("Avatar path:", avatarPath);
            expect(fs.existsSync(avatarPath)).toBe(true);

            const response = await request(app)
                .post('/api/v1/auth/register')
                .field("fname", "John")
                .field("lname", "Snow")
                .field("email", "johnsnow@gmail.com")
                .field("password", "12345678")
                .attach("avatar", avatarPath)
        
            expect(response.status).toBe(409); 
            expect(response.body).toHaveProperty("message", "User already exists with this email.");
        });

    })

    describe('POST /api/v1/auth/login', () => {

        //TEST CASE 1
        it('should fail if email or password is missing', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: "johnsnow@gmail.com",
                    password: "",
                })
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("message", "Validation failed")
        })

        //TEST CASE 2
        it('should fail if provide invalid email and valid password', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: "xyz@gmail.com",
                    password: "12345678",
                })
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty("message", "Email is not valid.")
        })

        //TEST CASE 3
        it('should fail if provide invalid password and valid email', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: "johnsnow@gmail.com",
                    password: "1234",
                })
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty("message", "Password is not valid.")
        })

        //TEST CASE 4
        it('should login successfully with valid email and password', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: "johnsnow@gmail.com",
                    password: "12345678",
                })
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty("message", "Login successful.")
        })
    })

    describe('GET /api/v1/auth/profile', () => {
        describe('given a accessToken in header', () => {
            it('should return a logged in user profile', async () => {
                const userDoc = await UserModel.create(
                    {
                        fname: 'Demo',
                        lname: 'Taylor',
                        email: 'demo@gmail.com',
                        password: '12345678',
                        avatar: 'https://demo.png'
                    }
                )
                // console.log("userDoc", userDoc)
                const payload = {
                    id: userDoc._id,
                    email: userDoc.email,
                }
                const secretKey = String(Constants.JWT_SECRET);
                const accessToken = JwtWrapper.sign(payload, secretKey, {expiresIn: '1m'});
                
                const response = await request(app)
                    .get('/api/v1/auth/profile')
                    .set('Authorization', `Bearer ${accessToken}`)
                expect(response.status).toBe(200)
                expect(response.body).toHaveProperty('message', 'User fetched successfully.')
            })
        })

        describe('access Token not provided in header', () => {
            it('should fail to return logged in user profile', async () => {
                const response = await request(app)
                    .get('/api/v1/auth/profile')
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty('message', 'Authentication token is missing.')
            })
        })
    })
})