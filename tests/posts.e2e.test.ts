import {req} from './test-helpers'
import {setDB} from '../src/db/db'
import {SETTINGS} from '../src/settings'
import {datasetblog, datasetpost} from "./datasets";
import {InputBlogType} from "../src/IO Types/InputBlogType";
import {InputPostType} from "../src/IO Types/InputPostType";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../src/db/mongoDB";
import request from "supertest";
import {app} from "../src/app";


describe('/posts', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        const mongoServer = await MongoMemoryServer.create();
        await db.runDB(mongoServer.getUri());
     })

    afterAll(async () => {
        await db.stop();
    });

    afterAll((done) => {
        done();
    });

    it('should remove all data, STATUS:204', async()=>{
        await request(app)
            .delete('/testing/all-data/')
            .expect(204)
    })

    it('should get empty array, STATUS:200', async () => {

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200)

         expect(res.body.length).toBe(0)
    })

    it('should create post, STATUS:200', async () => {
         //TODO переделать тесты начина отсюда
        setDB(datasetblog,datasetpost)

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200)

         expect(res.body.length).toBe(1)
             expect(res.body[0]).toEqual(datasetpost)
    })

    it('should create', async () => {
         setDB(datasetblog)
         const newPost: InputPostType = {
             title: 'string',
             shortDescription: 'string',
             content: 'string',
             blogId: '543134656'
         }

         const res = await req
             .post(SETTINGS.PATH.POSTS)
             .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
             .send(newPost) // отправка данных
             .expect(201)

         console.log(res.body)

         expect(res.body.shortDescription).toEqual(newPost.shortDescription)
     })

    it('should delete', async () => {
        setDB(datasetblog, datasetpost)
        const res = await req
            .delete(SETTINGS.PATH.POSTS+'/564635496821')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .expect(204)

        console.log(res.body)
    })

    it('should not find', async () => {
         const res = await req
             .get(SETTINGS.PATH.POSTS + '/1')
             .expect(404)
          console.log(res.body)

     })

    it('no auth', async () => {
        setDB(datasetblog)
        const newPost: InputPostType = {
            title: 'string',
            shortDescription: 'string',
            content: 'string',
            blogId: '543134656'
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .send(newPost) // отправка данных
            .expect(401)

    })

    it('Blog ID doesnt exist', async () => {
        //setDB(datasetblog)
        const newPost: InputPostType = {
            title: 'string',
            shortDescription: 'string',
            content: 'string',
            blogId: '63189b06003380064c4193be'
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send(newPost) // отправка данных
            .expect(400)

    })
})