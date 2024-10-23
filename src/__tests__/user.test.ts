import request from 'supertest'
import { app } from '../app'
import mongoose from 'mongoose'
import { UserModel } from '../models/user.model'
import { Constants } from '../constants'
import { JwtWrapper } from '../utils/jwt-wrapper'
import path from 'path'


describe('User Controller Testing', () => {

    beforeAll(async () => {
        try {
            await mongoose.connect('mongodb://localhost:27017/fileupload-test')
            // console.log('db connected')
        } catch (error) {
            console.error('Failed to connect db', error)
            process.exit(1);
        }
    })

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close()
        // console.log('db connection closed')
    })


    describe('POST /api/v1/users/update/avatar', () => {

        describe('given accessToken in header', () => {
            it('should update the user avatar', async () => {

                const userDoc = await UserModel.create({
                    fname: 'Demo1',
                    lname: 'Taylor1',
                    email: 'demo1@gmail.com',
                    password: '12345678',
                    avatar: 'https://demo.png'
                });

                const payload = {id: userDoc._id, email: userDoc.email};
                const secretKey = String(Constants.JWT_SECRET);
                const accessToken = JwtWrapper.sign(payload, secretKey, {expiresIn: "5m"});

                const avatarPath = path.join(__dirname, '../../', 'public/temp', 'test-avatar.png')
                const response = await request(app)
                    .post('/api/v1/users/update/avatar')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .attach('avatar', avatarPath)
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('message', 'Avatar updated successfully.')
            })
        })
    })
})