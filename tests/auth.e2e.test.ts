import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../src/db/mongoDB";
import {SETTINGS} from "../src/settings";
import request from "supertest";
import {app} from "../src/app";
import {createUser, createUsers} from "./utils/createUsers";

describe('AUTH_TESTS', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await db.runDB(mongoServer.getUri());
        await db.drop();
    });

    /*beforeEach(async () => {
        await db.drop();
    });*/

    afterAll(async () => {
        await db.stop();
    });

    afterAll((done) => {
        done();
    });
//Global storage of devices and tokens
    let Devices:any = []
    let ATokens:any = []
    let RTokens:any = []

    it('should remove all data', async()=>{
        await request(app)
            .delete('/testing/all-data/')
            .expect(204)

        Devices=[]
        ATokens=[]
        RTokens=[]
    })

    it('should create 2 users, get users list, STATUS:200', async () => {
        await createUsers(app,1);

        const res = await request(app)
            .get(`${SETTINGS.PATH.USERS + '/'}`)
            .expect(200);

        expect(res.body.items.length).toBe(2);
    });

    it ('should login user 4 times and get devices lists, STATUS:200', async () => {

        for (let i = 0; i < 4; i++) {
        const res = await request(app)
            .post(SETTINGS.PATH.AUTH + '/login')
            .set('user-agent', 'Agent'+i)
            .send({
                loginOrEmail: 'test0',
                password: '12345678'
            })
            .expect(200);

        expect(res.body.accessToken).toContain('.');
        expect(res.headers['set-cookie']).toBeDefined();

        ATokens.push(res.body.accessToken);

        const RToken = res.headers['set-cookie'][0].split(';');  //парсим рефреш токен
        RTokens.push(RToken[0]);
        }
        const resp = await request(app)
            .get(`${SETTINGS.PATH.DEVICES + '/'}`)
            .set('Cookie', RTokens[0])
            .expect(200)
        expect (resp.body.length).toBe(4)

        Devices = resp.body
    })

    it ('should remove second device, STATUS:204', async () =>{

        await request(app)
            .delete(`${SETTINGS.PATH.DEVICES + '/' + Devices[1].deviceId}`)
            .set('Cookie', RTokens[0])
            .expect(204);

        const resp = await request(app)
            .get(`${SETTINGS.PATH.DEVICES + '/'}`)
            .set('Cookie', RTokens[0])
            .expect(200)
        expect (resp.body.length).toBe(3)
    })

    it ('should remove all devices except first', async()=>{
        await request(app)
            .delete(`${SETTINGS.PATH.DEVICES + '/'}`)
            .set('Cookie', RTokens[0])
            .expect(204)

        const resp = await request(app)
            .get(`${SETTINGS.PATH.DEVICES + '/'}`)
            .set('Cookie', RTokens[0])
            .expect(200)
        expect (resp.body.length).toBe(1)
    })

    it('should login two users, then user2 tries to remove device of user1, STATUS:403', async()=>{
        Devices=[]
        ATokens=[]
        RTokens=[]

        for (let i = 0; i < 2; i++) {
            const res = await request(app)
                .post(SETTINGS.PATH.AUTH + '/login')
                .set('user-agent', 'Agent' + i)
                .send({
                    loginOrEmail: `test${i}`,
                    password: '12345678'
                })
                .expect(200);

            ATokens.push(res.body.accessToken);

            const RToken = res.headers['set-cookie'][0].split(';');  //парсим рефреш токен
            RTokens.push(RToken[0]);
        }

        const resp = await request(app)
            .get(`${SETTINGS.PATH.DEVICES + '/'}`)
            .set('Cookie', RTokens[0])
            .expect(200)

        Devices = resp.body

        request(app)
            .delete(`${SETTINGS.PATH.DEVICES + '/'+ Devices[0].deviceId}`)
            .set('Cookie', RTokens[1])
            .expect(403)
    })

    it('should remove all data', async()=>{
        await request(app)
            .delete('/testing/all-data/')
            .expect(204)

        Devices=[]
        ATokens=[]
        RTokens=[]
    })
});