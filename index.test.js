import { app, server } from './index.js'
import request from 'supertest'
import User from './users/model.js'
import sequelize from './shared/database/database.js'
import { Sequelize } from 'sequelize'

describe('User', () => {
    let data
    let mockedSequelize

    beforeEach(async () => {
        data = {
            "dni": "1234567890",
            "name": "Test"
        }
        jest.spyOn(console, 'log').mockImplementation(jest.fn())
        jest.spyOn(console, 'error').mockImplementation(jest.fn())
        jest.spyOn(sequelize, 'log').mockImplementation(jest.fn())
        mockedSequelize = new Sequelize({
            database: '<any name>',
            dialect: 'sqlite',
            username: 'root',
            password: '',
            validateOnly: true,
            models: [__dirname + '/models'],
        })
        await mockedSequelize.sync({ force: true })
    })

    afterEach(async () => {
        jest.clearAllMocks()
        await mockedSequelize.close()
    })

    afterAll(async () => {
        server.close()
    })

    test('Get users', async () => {
        jest.spyOn(User, 'findAll').mockResolvedValue([data])
        const response = await request(app).get('/api/users')

        expect(response.status).toBe(200)
        expect(response.body).toEqual([data])
    })

    test('Get user', async () => {
        jest.spyOn(User, 'findByPk').mockResolvedValue({...data, "id": 1})
        const response = await request(app).get('/api/users/1')

        expect(response.status).toBe(200)
        expect(response.body).toEqual({...data, "id": 1})
    })

    test('Get non-existent user', async () => {
        jest.spyOn(User, 'findByPk').mockResolvedValue(null)
        const response = await request(app).get('/api/users/999')

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
    })

    test('Create user', async () => {
        jest.spyOn(User, 'findOne').mockResolvedValue(null)
        jest.spyOn(User, 'create').mockResolvedValue({...data, "id": 1})
        const response = await request(app).post('/api/users').send(data)

        expect(response.status).toBe(201)
        expect(response.body).toEqual({...data, "id": 1})
    })

    test('Create user with missing dni', async () => {
        const invalidData = { name: "Test User" }
        const response = await request(app).post('/api/users').send(invalidData)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
    })

    test('Create user with missing name', async () => {
        const invalidData = { dni: "1234567890" }
        const response = await request(app).post('/api/users').send(invalidData)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
    })

    test('Create user with duplicate dni', async () => {
        // Mock that user already exists
        jest.spyOn(User, 'findOne').mockResolvedValue({...data, "id": 1})
        
        const response = await request(app).post('/api/users').send(data)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toContain('already exists')
    })
    
    test('Deactivate user', async () => {
        const userMock = { 
            id: 1, 
            active: true, 
            save: jest.fn().mockImplementation(function() {
                return Promise.resolve(this);
            })
        };
        jest.spyOn(User, 'findByPk').mockResolvedValue(userMock);

        const response = await request(app).patch('/api/users/1/deactivate');

        expect(response.status).toBe(200);
        expect(userMock.save).toHaveBeenCalled();
        expect(response.body).toHaveProperty('message', 'User deactivated');
    });

    test('Deactivate non-existent user', async () => {
        jest.spyOn(User, 'findByPk').mockResolvedValue(null);

        const response = await request(app).patch('/api/users/1/deactivate');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    test('Deactivate already inactive user', async () => {
        const userMock = { 
            id: 1, 
            active: false
        };
        jest.spyOn(User, 'findByPk').mockResolvedValue(userMock);

        const response = await request(app).patch('/api/users/1/deactivate');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('User is already deactivated');
    });

    test('Reactivate user', async () => {
        const userMock = { 
            id: 1, 
            active: false,
            save: jest.fn().mockImplementation(function() {
                return Promise.resolve(this);
            })
        };
        jest.spyOn(User, 'findByPk').mockResolvedValue(userMock);

        const response = await request(app).patch('/api/users/1/reactivate');

        expect(response.status).toBe(200);
        expect(userMock.save).toHaveBeenCalled();
        expect(response.body).toHaveProperty('message', 'User reactivated');
    });

    test('Reactivate already active user', async () => {
        const userMock = { 
            id: 1, 
            active: true
        };
        jest.spyOn(User, 'findByPk').mockResolvedValue(userMock);

        const response = await request(app).patch('/api/users/1/reactivate');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('User is already active');
    });

    test('Delete user', async () => {
        const userMock = { 
            id: 1, 
            destroy: jest.fn().mockResolvedValue() 
        };
        jest.spyOn(User, 'findByPk').mockResolvedValue(userMock);

        const response = await request(app).delete('/api/users/1');

        expect(response.status).toBe(200);
        expect(userMock.destroy).toHaveBeenCalled();
        expect(response.body).toHaveProperty('message', 'User deleted');
    });

    test('Delete non-existent user', async () => {
        jest.spyOn(User, 'findByPk').mockResolvedValue(null);

        const response = await request(app).delete('/api/users/1');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });
});