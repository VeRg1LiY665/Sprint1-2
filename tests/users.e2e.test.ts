import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createUser } from './utils/createUsers';
import { testingDtosCreator } from './utils/testingDtosCreator';
import {db} from "../src/db/mongoDB";
import {app} from "../src/app";
import {SETTINGS} from "../src/settings";

describe('USERS_TESTS', () => {
    //const app = startApp();

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await db.runDB(mongoServer.getUri());
    });

    beforeEach(async () => {
        await db.drop();
    });

    afterAll(async () => {
        await db.stop();
    });

    afterAll((done) => {
        done();
    });

    let userDto: any;

    it('shouldn`t create user without authorization: STATUS 401', async () => {
        await request(app)
            .post(SETTINGS.PATH.USERS)
            .send({
                login: '',
            })
            .expect(401);
    });
    it('should create user with correct data by sa and return it: STATUS 201', async () => {
        userDto = testingDtosCreator.createUserDto({});

        const newUser = await request(app)
            .post(SETTINGS.PATH.USERS)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({ login: userDto.login, email: userDto.email, password: userDto.password })
            .expect(201);

        expect(newUser.body).toEqual({
            id: expect.any(String),
            login: userDto.login,
            email: userDto.email,
            createdAt: expect.any(String),
        });
    });
    it('shouldn`t create user twice with correct data by sa: STATUS 400', async () => {
        userDto = testingDtosCreator.createUserDto({});
        const user = await createUser(app, userDto);
        await request(app)
            .post(SETTINGS.PATH.USERS)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send(user)
            .expect(400);
    });
    it('shouldn`t create user with incorrect login: STATUS 400', async () => {
        userDto = testingDtosCreator.createUserDto({ login: '' });
        await request(app)
            .post(SETTINGS.PATH.USERS)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({ login: userDto.login, email: userDto.email, password: userDto.pass })
            .expect(400);
    });
    it('shouldn`t create user with incorrect email: STATUS 400', async () => {
        userDto = testingDtosCreator.createUserDto({ email: 'hhh' });
        await request(app)
            .post(SETTINGS.PATH.USERS)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({ login: userDto.login, email: userDto.email, password: userDto.pass })
            .expect(400);
    });
    it('shouldn`t create user with incorrect password: STATUS 400', async () => {
        userDto = testingDtosCreator.createUserDto({ password: 'hh' });
        await request(app)
            .post(SETTINGS.PATH.USERS)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({ login: userDto.login, email: userDto.email, password: userDto.pass })
            .expect(400);
    });
    it('shouldn`t delete user by id without authorization: STATUS 401', async () => {
        const user = await createUser(app);

        await request(app)
            .delete(`${SETTINGS.PATH.USERS + '/' + user.id}`)
            .expect(401);
    });

    it('should delete user by id: STATUS 204', async () => {
        const user = await createUser(app);

        await request(app)
            .delete(`${SETTINGS.PATH.USERS + '/' + user.id}`)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .expect(204);
    });

    it('shouldn`t delete user by id if specified user is not exists: STATUS 404', async () => {
        await request(app)
            .delete(`${SETTINGS.PATH.USERS + '/67cd5c63e5cc297ec253fc69'}`)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .expect(404);
    });
});